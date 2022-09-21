import { 
   ChangeList, 
   Schema$File, 
   GA$QueryDriveActivityResponse, 
   StartPageToken, 
   WebhookRequest, 
   GA$DriveActivity
} from "../types";
import { 
   getGoogleDriveActivityClient, 
   getGoogleDriveClient 
} from "../clients/google-client";
import { 
   ExceptionType, 
} from '../constant';
import {
   drive_v3,
} from 'googleapis';
import { tryPromise } from "../utils/utils";
import moment from 'moment'
import { GoogleResourceState } from "../constant/google-kinds";
import { head } from "lodash";
import { manageCommentOnFile } from "./webhook-notifications/comments";
import { sharedAFile } from "./webhook-notifications/shared-file";

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

   const activityClient = await getGoogleDriveActivityClient(call);
   const paramsActivity = {
      pageSize: 1,
      filter: `time >= \"${modifiedTime}\" AND time < \"${file.modifiedTime}\"`
   };

   const activityRes = await tryPromise<GA$QueryDriveActivityResponse>(activityClient.activity.query({ requestBody: paramsActivity }), ExceptionType.TEXT_ERROR, 'Google failed: ');
   if (!Object.keys(activityRes).length) {
      await sharedAFile(call, file);
      return;
   }

   const activity = head(activityRes?.activities) as GA$DriveActivity;
   if (!!activity.primaryActionDetail?.comment) {
      await manageCommentOnFile(call, file, activity);
      return;
   }
}


