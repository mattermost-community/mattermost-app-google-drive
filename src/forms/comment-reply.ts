import {
   AppCallRequest,
   AppForm,
   MattermostOptions,
   Params$Resource$Replies$Create,
   PostCreate,
} from "../types";
import { getGoogleDriveClient } from "../clients/google-client";
import {
   AppExpandLevels,
   AppFieldSubTypes,
   AppFieldTypes,
   ExceptionType,
   GoogleDriveIcon,
   ReplyCommentForm,
   Routes
} from '../constant';
import { tryPromise } from "../utils/utils";
import { CommentState, ReplyCommentFormType } from "../types/forms";
import { MattermostClient } from "../clients";


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
            acting_user: AppExpandLevels.EXPAND_SUMMARY,
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