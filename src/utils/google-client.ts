import { KVStoreClient } from "../clients";
import { StoreKeys } from "../constant";
import { AppCallRequest, KVStoreOptions, KVStoreProps, Oauth2App } from "../types";
import {
   google,
   Auth,
} from 'googleapis';

export const getOAuthGoogleClient = async (call: AppCallRequest): Promise<Auth.OAuth2Client> => {
   const oauth2App: Oauth2App = call.context.oauth2 as Oauth2App;
   
   const oAuth2Client = new google.auth.OAuth2(
      oauth2App.client_id,
      oauth2App.client_secret,
      oauth2App.complete_url
   );

   return oAuth2Client;
}