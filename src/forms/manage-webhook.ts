import { 
   ChangeList, 
   Schema$File, 
   GA$QueryDriveActivityResponse, 
   StartPageToken, 
   WebhookRequest, 
   GA$DriveActivity,
   Change
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
import moment, { Moment } from 'moment'
import { GoogleResourceState } from "../constant/google-kinds";
import { head } from "lodash";
import { manageCommentOnFile } from "./webhook-notifications/comments";
import { sharedAFile } from "./webhook-notifications/shared-file";
import GeneralConstants from '../constant/general';

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
      pageToken: (Number(pageToken?.startPageToken) - GeneralConstants.REMOVE_ONE).toString(),
      fields: '*'
   }

   const list = await tryPromise<ChangeList>(drive.changes.list(params), ExceptionType.TEXT_ERROR, 'Google failed: ');
   const lastChange = head(list.changes) as Change;
   const file = lastChange?.file as Schema$File;
   const changeTime: Moment = moment(lastChange.time);
   const fileModified: Moment = moment(file.modifiedTime);
   
   if (!!file.lastModifyingUser?.me || moment(changeTime).diff(moment(fileModified)) > GeneralConstants.SECOND_AND_HALF) {
      return;
   }

   const modifiedTime: Moment = moment(file.modifiedTime).subtract(GeneralConstants.REMOVE_ONE, 'second');

   const activityClient = await getGoogleDriveActivityClient(call);
   const paramsActivity = {
      pageSize: GeneralConstants.PAGE_ONE,
      filter: `time >= \"${ modifiedTime.toISOString() }\" AND time < \"${ fileModified.toISOString() }\"`,
      itemName: `items/${file.id}`
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


