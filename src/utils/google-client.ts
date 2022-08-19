import { KVStoreClient } from "../clients";
import { StoreKeys } from "../constant";
import { AppCallRequest, KVStoreOptions, KVStoreProps } from "../types";
import {
   google,
   Auth,
} from 'googleapis';

export const getOAuthGoogleClient = async (call: AppCallRequest): Promise<Auth.OAuth2Client> => {
   const mattermostUrl: string | undefined = call.context.mattermost_site_url;
   const botAccessToken: string | undefined = call.context.bot_access_token;
   const oAuth2CompleteUrl: string | undefined = call.context.oauth2?.complete_url;
   const kvOptions: KVStoreOptions = {
      mattermostUrl: <string>mattermostUrl,
      accessToken: <string>botAccessToken
   };

   const kvStoreClient = new KVStoreClient(kvOptions);
   const kvStoreProps: KVStoreProps = await kvStoreClient.kvGet(StoreKeys.config);

   const oAuth2Client = new google.auth.OAuth2(
      kvStoreProps.google_drive_client_id,
      kvStoreProps.google_drive_client_secret,
      oAuth2CompleteUrl
   );

   return oAuth2Client;
}