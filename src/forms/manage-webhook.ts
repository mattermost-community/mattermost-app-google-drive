import { ChangeList, Manifest, Schema$Comment, Schema$CommentList, Schema$File, StartPageToken, WebhookRequest } from "../types";
import { getGoogleDriveClient } from "../utils/google-client";
import { postBotChannel } from '../utils/post-in-channel';
import manifest from '../manifest.json';
import { h5, hyperlink, inLineImage } from '../utils/markdown';
import { AppExpandLevels, ExceptionType, GoogleDriveIcon, Routes } from '../constant';
import {
   drive_v3,
} from 'googleapis';
import { tryPromise } from "../utils/utils";
import moment from 'moment'

export async function manageWebhookCall(call: WebhookRequest): Promise<void> {
   if (call.values.headers["X-Goog-Resource-State"] !== 'change') {
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
   const file = list.changes?.[0].file as Schema$File;

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
   const comment = commentRes.comments[0];

   if (moment(comment.createdTime).diff(comment.modifiedTime) === 0) {
      await firstComment(call, file, comment);
   }
   return;
}

export async function firstComment(call: WebhookRequest, file: Schema$File, comment: Schema$Comment): Promise<void> {
   const m = manifest;
   const author = comment.author;
   const message = h5(`${author?.displayName} commented on ${inLineImage(`File icon`, <string>file?.iconLink)} ${hyperlink(`${file?.name}`, <string>file?.webViewLink)}`);

   const props = {
      app_bindings: [
         {
            location: "embedded",
            app_id: m.app_id,
            description: `_${comment.quotedFileContent?.value || ' '}_  \n> "${comment.content}"`,
            bindings: [
               {
                  submit: {
                     expand: {
                        oauth2_user: AppExpandLevels.EXPAND_SUMMARY,
                        oauth2_app: AppExpandLevels.EXPAND_SUMMARY,
                        post: AppExpandLevels.EXPAND_SUMMARY
                     },
                     state: {
                        comment: {
                           id: comment.id
                        }
                     }
                  }
               }
            ]
         }
      ]
   }
   await postBotChannel(call, message, props);
}