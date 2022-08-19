import { ExceptionType } from "../constant";
import { AppCallRequest, GoogleToken, Oauth2App, StartPageToken } from "../types";
import { getOAuthGoogleClient } from "../utils/google-client";
import { tryPromise } from "../utils/utils";
import {
   drive_v3,
   Auth,     
} from 'googleapis';
import { GoogleKindsAPI } from "../constant/google-kinds";

export async function stopNotificationsCall(call: AppCallRequest): Promise<string> {
   const mattermostUrl: string | undefined = call.context.mattermost_site_url;
   const accessToken: string | undefined = call.context.acting_user_access_token;
   const oauth2: Oauth2App | undefined = call.context.oauth2 as Oauth2App;

   const oauth2Client = getOAuthGoogleClient(call);

   return 'Google notifications are disabled!';
}

export async function startNotificationsCall(call: AppCallRequest): Promise<string> {
   const oauth2Token: GoogleToken | undefined = call.context.oauth2?.user?.token as GoogleToken;

   const oauth2Client = await getOAuthGoogleClient(call);
   oauth2Client.setCredentials(<GoogleToken>oauth2Token);
   await tryPromise(oauth2Client.refreshAccessToken(), ExceptionType.MARKDOWN, 'Google failed: ');
   
   const drive = new drive_v3.Drive({
      auth: oauth2Client
   });

   const pageToken = await tryPromise<StartPageToken>(drive.changes.getStartPageToken(), ExceptionType.TEXT_ERROR, 'Google failed: ');
   
   const params = {
      pageToken: <string>pageToken.startPageToken,
      requestBody: {
         kind: GoogleKindsAPI.CHANNEL,
         id: "0f811715-3505-46ac-a014-6d478812a672",
         address: "https://799a-201-160-205-66.ngrok.io/notifications",
         type: "web_hook"
      }
   }
   
   await tryPromise(drive.changes.watch(params), ExceptionType.TEXT_ERROR, 'Google failed: ');
   return 'Google notifications are enabled!';
}