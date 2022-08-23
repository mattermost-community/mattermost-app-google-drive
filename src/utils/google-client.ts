import { KVStoreClient } from "../clients";
import { ExceptionType, StoreKeys } from "../constant";
import { AppCallRequest, KVStoreOptions, KVStoreProps, Oauth2App, Oauth2Data } from "../types";
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

export const getGoogleDriveClient = async (call: AppCallRequest): Promise<any> => {
   const oauth2Client = await getOAuthGoogleClient(call);

   oauth2Client.setCredentials({
      refresh_token: '1//0f8AMjFxyFDpKCgYIARAAGA8SNwF-L9Ir19A0Zf-7sirnrsvSNvq7hyVCzyxb4JezyRoGeOSf8m2d4J6KGZVn7mkTB5omgyoNgik'
   });

   await tryPromise(oauth2Client.refreshAccessToken(), ExceptionType.MARKDOWN, 'Google failed: ');

   return google.drive({
      version: 'v3',
      auth: oauth2Client,
   });
}