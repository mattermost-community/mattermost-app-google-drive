import { 
   AppCallRequest,
   AppForm,
   ChangeList, 
   MattermostOptions, 
   Params$Resource$Replies$Create, 
   PostCreate, 
   Schema$About, 
   Schema$Comment, 
   Schema$CommentList, 
   Schema$File, 
   Schema$User, 
   StartPageToken, 
   WebhookRequest 
} from "../types";
import { getGoogleDriveClient } from "../clients/google-client";
import { postBotChannel } from '../utils/post-in-channel';
import manifest from '../manifest.json';
import { h5, hyperlink, inLineImage } from '../utils/markdown';
import { 
   ActionsEvents, 
   AppExpandLevels, 
   AppFieldSubTypes, 
   AppFieldTypes, 
   ExceptionType, 
   GoogleDriveIcon, 
   ReplyCommentForm, 
   Routes 
} from '../constant';
import {
   drive_v3,
} from 'googleapis';
import { tryPromise } from "../utils/utils";
import moment from 'moment'
import { GoogleResourceState } from "../constant/google-kinds";
import { head } from "lodash";
import { CommentState, ReplyCommentFormType } from "../types/forms";
import { MattermostClient } from "../clients";

export async function manageWebhookCall(call: WebhookRequest): Promise<void> {
   if (call.values.headers["X-Goog-Resource-State"] !== GoogleResourceState.CHANGE) {
      return;
   }
   const paramsd = new URLSearchParams(call.values.rawQuery);
   const userId = paramsd.get('userId');

   const acting_user = {
      id: userId
   }
   call.context = { ...call.context, acting_user }

   const drive: drive_v3.Drive = await getGoogleDriveClient(call);
   const pageToken = await tryPromise<StartPageToken>(drive.changes.getStartPageToken(), ExceptionType.TEXT_ERROR, 'Google failed: ');
   
   const params = {
      pageToken: (Number(pageToken?.startPageToken)-1).toString(),
      fields: '*'
   }

   const list = await tryPromise<ChangeList>(drive.changes.list(params), ExceptionType.TEXT_ERROR, 'Google failed: ');
   const file = head(list.changes)?.file as Schema$File;

   const modifiedTime: string = moment(file.modifiedTime).subtract(1, 'second').toISOString();

   const commentParam = {
      fileId: <string>file.id,
      startModifiedTime: modifiedTime,
      pageToken: (Number(pageToken?.startPageToken) - 1).toString(),
      fields: '*'
   }
   const commentRes = await tryPromise<Schema$CommentList>(drive.comments.list(commentParam), ExceptionType.TEXT_ERROR, 'Google failed: ');
   if (!commentRes.comments?.length) {
      return;
   }
   const comment = head(commentRes.comments) as Schema$Comment;
   const about: Schema$About = await tryPromise<Schema$About>(drive.about.get({fields: 'user'}), ExceptionType.TEXT_ERROR, 'Google failed: ');

   if (moment(comment.createdTime).diff(comment.modifiedTime) === 0) {
      await firstComment(call, file, comment, about.user);
   }

   return;
}

export async function firstComment(call: WebhookRequest, file: Schema$File, comment: Schema$Comment, user: Schema$User): Promise<void> {
   const m = manifest;
   const author = comment.author;
   const message = comment.content?.includes(<string>user.emailAddress)
      ? h5(`${author?.displayName} mentioned you in ${inLineImage(`File icon`, `${file?.iconLink} =15x15`)} ${hyperlink(`${file?.name}`, <string>file?.webViewLink)}`)
      : h5(`${author?.displayName} commented on ${inLineImage(`File icon`, `${file?.iconLink} =15x15`)} ${hyperlink(`${file?.name}`, <string>file?.webViewLink)}`);

   const props = {
      app_bindings: [
         {
            location: "embedded",
            app_id: m.app_id,
            description: `${comment.quotedFileContent?.value || ' '}\n ___ \n> "${comment.content}"`,
            bindings: [
               {
                  location: ActionsEvents.REPLY_COMMENTS,
                  label: 'Reply to comment',
                  submit: {
                     path: Routes.App.CallPathCommentReplayForm,
                     expand: {
                        oauth2_user: AppExpandLevels.EXPAND_SUMMARY,
                        oauth2_app: AppExpandLevels.EXPAND_SUMMARY,
                        post: AppExpandLevels.EXPAND_SUMMARY
                     },
                     state: {
                        comment: {
                           id: comment.id
                        },
                        file: {
                           id: file.id
                        }
                     }
                  }
               }
            ]
         }
      ]
   }
   await postBotChannel(call, message, props);
   return;
}

export async function openFormReplyComment(call: AppCallRequest): Promise<AppForm> {
   const state = call.state;
   return {
      title: 'Reply to comment',
      icon: GoogleDriveIcon,
      fields: [
         {
            type: AppFieldTypes.TEXT,
            name: ReplyCommentForm.RESPONSE,
            subtype: AppFieldSubTypes.TEXTAREA,
            modal_label: 'Message response',
            description: 'Add a message that will be posted as thread on the selected post',
            is_required: true,
         }
      ],
      submit: {
         path: Routes.App.CallPathCommentReplaySubmit,
         expand: {
            acting_user_access_token: AppExpandLevels.EXPAND_ALL,
            oauth2_user: AppExpandLevels.EXPAND_SUMMARY,
            oauth2_app: AppExpandLevels.EXPAND_SUMMARY,
            post: AppExpandLevels.EXPAND_SUMMARY
         },
         state
      },
   }
}

export async function manageReplyCommentSubmit(call: AppCallRequest): Promise<any> {
   const drive = await getGoogleDriveClient(call);
   const comment: CommentState = call.state as CommentState;
   const values = call.values as ReplyCommentFormType;

   const newReply: Params$Resource$Replies$Create = {
      commentId: comment.comment.id,
      fileId: comment.file.id,
      fields: '*',
      requestBody: {
         content: values.google_response_comment
      }
   }

   await tryPromise<any>(drive.replies.create(newReply), ExceptionType.TEXT_ERROR, 'Google failed: ');

   const mattermostUrl: string | undefined = call.context.mattermost_site_url;
   const postId: string | undefined = call.context.post?.id;
   const channelId: string | undefined = call.context.post?.channel_id;
   const actingUserID: string | undefined = call.context.acting_user?.id;
   const botAccessToken = call.context.bot_access_token as string;

   const mattermostOpts: MattermostOptions = {
      mattermostUrl: <string>mattermostUrl,
      accessToken: <string>botAccessToken
   };
   const mmClient: MattermostClient = new MattermostClient(mattermostOpts);

   const post: PostCreate = {
      message: `You replied to this comment with: \n"${values.google_response_comment}"`,
      user_id: <string>actingUserID,
      channel_id: <string>channelId,
      root_id: postId
   };
   await mmClient.createPost(post);
}