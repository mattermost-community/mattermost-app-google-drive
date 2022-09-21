import { 
   ExceptionType, 
   Routes, 
   StoreKeys 
} from "../constant";
import { 
   AppCallRequest, 
   ChannelNotification, 
   KVStoreOptions, 
   Schema$Channel, 
   StartPageToken 
} from "../types";
import { 
   getGoogleDriveClient 
} from "../clients/google-client";
import { 
   tryPromise 
} from "../utils/utils";
import { 
   GoogleKindsAPI 
} from "../constant/google-kinds";
import { v4 as uuidv4 } from 'uuid';
import { 
   KVStoreClient 
} from "../clients";
require('dotenv').config('../');

export async function stopNotificationsCall(call: AppCallRequest): Promise<string> {
   const mattermostUrl: string | undefined = call.context.mattermost_site_url;
   const botAccessToken: string | undefined = call.context.bot_access_token;
   const actingUser: string | undefined = call.context.acting_user?.id;

   const options: KVStoreOptions = {
      mattermostUrl: <string>mattermostUrl,
      accessToken: <string>botAccessToken,
   };
   const kvStoreClient = new KVStoreClient(options);
   const channelNotification: ChannelNotification = await kvStoreClient.kvGet(`${actingUser}-channel`);

   const drive = await getGoogleDriveClient(call);
   const stopParams = {
      requestBody: {
         id: channelNotification.channelId,
         resourceId: channelNotification.resourceId,
      }
   }
   await tryPromise<Schema$Channel>(drive.channels.stop(stopParams), ExceptionType.TEXT_ERROR, 'Google failed: ');
   await kvStoreClient.kvSet(`${actingUser}-${StoreKeys.channel}`, {});

   return 'Google notifications are disabled!';
}

export async function startNotificationsCall(call: AppCallRequest): Promise<string> {
   const mattermostUrl: string | undefined = process.env.LOCAL == 'TRUE' ?
      process.env.MATTERMOST_URL as string :
      call.context.mattermost_site_url;

   const botAccessToken: string | undefined = call.context.bot_access_token;
   const appPath: string | undefined = call.context.app_path;
   const actingUser: string | undefined = call.context.acting_user?.id;

   const drive = await getGoogleDriveClient(call);

   const pageToken = await tryPromise<StartPageToken>(drive.changes.getStartPageToken(), ExceptionType.TEXT_ERROR, 'Google failed: ');
   
   const urlWithParams = new URL(`${mattermostUrl}${appPath}${Routes.App.CallPathIncomingWebhookPath}`);
   urlWithParams.searchParams.append('userId', <string>actingUser);

   const params = {
      pageToken: <string>pageToken.startPageToken,
      fields: '*',
      requestBody: {
         kind: GoogleKindsAPI.CHANNEL,
         id: uuidv4(),
         address: urlWithParams.href,
         type: "web_hook",
         payload: true,
         params: {
            userId: <string>actingUser
         }
      }
   }
   
   const watchChannel = await tryPromise<Schema$Channel>(drive.changes.watch(params), ExceptionType.TEXT_ERROR, 'Google failed: ');

   const options: KVStoreOptions = {
      mattermostUrl: <string>mattermostUrl,
      accessToken: <string>botAccessToken,
   };
   const kvStoreClient = new KVStoreClient(options);

   const currentChannel: ChannelNotification = {
      channelId: <string>watchChannel.id,
      resourceId: <string>watchChannel.resourceId
   };

   await kvStoreClient.kvSet(`${actingUser}-${StoreKeys.channel}`, currentChannel);
   return 'Google notifications are enabled!';
}