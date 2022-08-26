import { KVStoreClient } from "../clients";
import { ExceptionType, StoreKeys } from "../constant";
import { AppCallRequest, KVStoreOptions, KVStoreProps, Oauth2App, Oauth2CurrentUser, Oauth2Data } from "../types";
import {
   google,
   drive_v3,
   Auth,
} from 'googleapis';
import { getGoogleOAuthScopes } from "./oauth-scopes";
import { tryPromise } from "./utils";



export const getOAuthGoogleClient = async (call: AppCallRequest): Promise<Auth.OAuth2Client> => {
   const oauth2App: Oauth2App = call.context.oauth2 as Oauth2App;
   
   const oAuth2Client = new google.auth.OAuth2(
      oauth2App.client_id,
      oauth2App.client_secret,
      oauth2App.complete_url,
   );

   return oAuth2Client;
}

export const getGoogleDriveClient = async (call: AppCallRequest): Promise<drive_v3.Drive> => {
   const mattermostUrl: string | undefined = call.context.mattermost_site_url;
   const botAccessToken: string | undefined = call.context.bot_access_token;
   const userID: string | undefined = call.context.acting_user?.id;
   let oauth2Token = call.context.oauth2?.user as Oauth2CurrentUser;

   if (!oauth2Token?.refresh_token) {
      const kvOptions: KVStoreOptions = {
         mattermostUrl: <string>mattermostUrl,
         accessToken: <string>botAccessToken
      };
      const kvStoreClient = new KVStoreClient(kvOptions);
      oauth2Token = await kvStoreClient.kvGet(<string>userID);
   }

   const oauth2Client = await getOAuthGoogleClient(call);
   oauth2Client.setCredentials(oauth2Token);
   await tryPromise(oauth2Client.refreshAccessToken(), ExceptionType.MARKDOWN, 'Google failed: ');

   return google.drive({
      version: 'v3',
      auth: oauth2Client,
   });
}