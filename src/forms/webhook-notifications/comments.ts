import { head, last } from "lodash";
import { getGoogleDriveClient } from "../../clients/google-client";
import { ActionsEvents, AppExpandLevels, ExceptionType, Routes } from "../../constant";
import { 
   GA$Actor,
   GA$CommentSubtype, 
   GA$DriveActivity, 
   GA$Target, 
   PostBasicData, 
   Schema$About, 
   Schema$Comment, 
   Schema$CommentList, 
   Schema$File, 
   Schema$Reply, 
   Schema$User, 
   StateCommentPost, 
   WebhookRequest 
} from "../../types";
import manifest from '../../manifest.json';
import { tryPromise } from "../../utils/utils";
import { bold, h5, hyperlink, inLineImage } from "../../utils/markdown";
import { postBotChannel } from "../../utils/post-in-channel";


export async function manageCommentOnFile(call: WebhookRequest, file: Schema$File, activity: GA$DriveActivity): Promise<void> {
   const subtype = activity.primaryActionDetail?.comment?.post?.subtype as GA$CommentSubtype;
   
   const action: Function = COMMENT_ACTIONS[subtype];
   if (action) {
      await action(call, file, activity);
   }
   return;
}

const COMMENT_ACTIONS: { [key in GA$CommentSubtype]: Function } = {
   SUBTYPE_UNSPECIFIED: funCommentSubtypeUnspecified,
   ADDED: funCommentAdded,
   DELETED: funCommentDeleted,
   REPLY_ADDED: funCommentReplyAdded,
   REPLY_DELETED: funCommentReplyDeleted,
   RESOLVED: funCommentResolved,
   REOPENED: funCommentReOpened,
};

async function funCommentSubtypeUnspecified(call: WebhookRequest, file: Schema$File, activity: GA$DriveActivity) {
}

async function funCommentAdded(call: WebhookRequest, file: Schema$File, activity: GA$DriveActivity) {
   const drive = await getGoogleDriveClient(call);
   const target = head(activity.targets) as GA$Target;
   const urlToComment = target.fileComment?.linkToDiscussion as string;

   const commentParam = {
      fileId: <string>file.id,
      commentId: <string>target.fileComment?.legacyCommentId,
      fields: '*'
   }

   const comment = await tryPromise<Schema$Comment>(drive.comments.get(commentParam), ExceptionType.TEXT_ERROR, 'Google failed: ');

   const author = comment.author;
   const about: Schema$About = await tryPromise<Schema$About>(drive.about.get({ fields: 'user' }), ExceptionType.TEXT_ERROR, 'Google failed: ');

   const message = comment.content?.includes(<string>about.user.emailAddress)
      ? h5(`${author?.displayName} mentioned you in ${inLineImage(`File icon`, `${file?.iconLink} =15x15`)} ${hyperlink(`${file?.name}`, <string>urlToComment)}`)
      : h5(`${author?.displayName} commented on ${inLineImage(`File icon`, `${file?.iconLink} =15x15`)} ${hyperlink(`${file?.name}`, <string>urlToComment)}`);

   const description = `${comment.quotedFileContent?.value || ' '}\n ___ \n> ${comment.content}`;

   const postData: PostBasicData = {
      message: message,
      description: description
   }
   const state: StateCommentPost = {
      comment: {
         id: <string>target.fileComment?.legacyCommentId,
      },
      file: {
         id: <string>file.id,
      }
   }
   await postNewCommentOnMattermost(call, postData, state);
}

async function funCommentReplyAdded(call: WebhookRequest, file: Schema$File, activity: GA$DriveActivity) {
   const drive = await getGoogleDriveClient(call);
   const target = head(activity.targets) as GA$Target;
   const urlToComment = target.fileComment?.linkToDiscussion as string;

   const commentParam = {
      fileId: <string>file.id,
      commentId: <string>target.fileComment?.legacyDiscussionId,
      fields: '*'
   }

   const comment = await tryPromise<Schema$Comment>(drive.comments.get(commentParam), ExceptionType.TEXT_ERROR, 'Google failed: ');
   const lastReply = last(comment.replies) as Schema$Reply;
   const oneBeforeLast = (comment.replies as Schema$Reply[]).at(-2) as Schema$Reply;
   const author = lastReply.author;
   
   const message = h5(`${author?.displayName} replied to a comment in ${inLineImage(`File icon`, `${file?.iconLink} =15x15`)} ${hyperlink(`${file?.name}`, <string>urlToComment)}`)

   const description = `${bold('Previous reply:')}\n ${oneBeforeLast.content || ' '}\n ___ \n> ${lastReply.content}`;

   const postData: PostBasicData = {
      message: message,
      description: description
   }
   const state: StateCommentPost = {
      comment: {
         id: <string>target.fileComment?.legacyDiscussionId,
      },
      file: {
         id: <string>file.id,
      }
   }
   await postNewCommentOnMattermost(call, postData, state);

}

async function funCommentResolved(call: WebhookRequest, file: Schema$File, activity: GA$DriveActivity) {
   const drive = await getGoogleDriveClient(call);
   const target = head(activity.targets) as GA$Target;
   const urlToComment = target.fileComment?.linkToDiscussion as string;

   const commentParam = {
      fileId: <string>file.id,
      commentId: <string>target.fileComment?.legacyDiscussionId,
      fields: '*'
   }

   const comment = await tryPromise<Schema$Comment>(drive.comments.get(commentParam), ExceptionType.TEXT_ERROR, 'Google failed: ');
   const author = comment.author;
   
   const message = h5(`${author?.displayName} marked a thread as resolved in ${inLineImage(`File icon`, `${file?.iconLink} =15x15`)} ${hyperlink(`${file?.name}`, <string>urlToComment)}`)
   const description = `${comment.quotedFileContent?.value || ' '}\n ___ \n> ${comment.content}`;

   await postBotChannel(call, message, {});
   return;
}

async function funCommentReOpened(call: WebhookRequest, file: Schema$File, activity: GA$DriveActivity) {
   const drive = await getGoogleDriveClient(call);
   const target = head(activity.targets) as GA$Target;
   const urlToComment = target.fileComment?.linkToDiscussion as string;

   const commentParam = {
      fileId: <string>file.id,
      commentId: <string>target.fileComment?.legacyDiscussionId,
      fields: '*'
   }

   const comment = await tryPromise<Schema$Comment>(drive.comments.get(commentParam), ExceptionType.TEXT_ERROR, 'Google failed: ');
   const lastReply = last(comment.replies) as Schema$Reply;
   const author = lastReply.author;

   const message = h5(`${author?.displayName} reopened a thread in ${inLineImage(`File icon`, `${file?.iconLink} =15x15`)} ${hyperlink(`${file?.name}`, <string>urlToComment)}`)

   const description = `${bold('Original comment:')}\n ${comment.content || ' '}\n ___ \n> ${lastReply.content}`;

   const postData: PostBasicData = {
      message: message,
      description: description
   }
   const state: StateCommentPost = {
      comment: {
         id: <string>target.fileComment?.legacyDiscussionId,
      },
      file: {
         id: <string>file.id,
      }
   }
   await postNewCommentOnMattermost(call, postData, state);

}

async function funCommentDeleted(call: WebhookRequest, file: Schema$File, activity: GA$DriveActivity) {
   const target = head(activity.targets) as GA$Target;
   const urlToComment = target.fileComment?.linkToDiscussion as string;

   const message = h5(`A comment was deleted in ${inLineImage(`File icon`, `${file?.iconLink} =15x15`)} ${hyperlink(`${file?.name}`, <string>urlToComment)}`)
   await postBotChannel(call, message, {});
   return;
}

async function funCommentReplyDeleted(call: WebhookRequest, file: Schema$File, activity: GA$DriveActivity) {
   const target = head(activity.targets) as GA$Target;
   const urlToComment = target.fileComment?.linkToDiscussion as string;

   const message = h5(`A comment reply was deleted in ${inLineImage(`File icon`, `${file?.iconLink} =15x15`)} ${hyperlink(`${file?.name}`, <string>urlToComment)}`)
   await postBotChannel(call, message, {});
   return;
}

export async function postNewCommentOnMattermost(call: WebhookRequest, postData: PostBasicData, state: StateCommentPost): Promise<void> {
   const props = {
      app_bindings: [
         {
            location: "embedded",
            app_id: manifest.app_id,
            description: postData.description,
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
                     state: state
                  }
               }
            ]
         }
      ]
   }
   await postBotChannel(call, postData.message, props);
   return;
}