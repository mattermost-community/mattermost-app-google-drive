import { Request, Response } from 'express';
import { AppCallRequest, GoogleWebhook, KVStoreOptions, KVStoreProps, Manifest, Oauth2App, WebhookRequest } from "../types";
import { getOAuthGoogleClient } from "../utils/google-client";
import { postBotChannel } from '../utils/post-in-channel';
import manifest from '../manifest.json';
import { h6, hyperlink } from '../utils/markdown';
import { AppExpandLevels, Routes, StoreKeys } from '../constant';
import { KVStoreClient } from '../clients';

export async function manageWebhookCall(call: WebhookRequest): Promise<void> {
   const mattermostUrl: string | undefined = call.context.mattermost_site_url;
   const accessToken: string | undefined = call.context.acting_user_access_token;
   const m: Manifest = manifest;

   const params = new URLSearchParams(call.values.rawQuery);
   const userId = params.get('userId');
   
   const kvOptionsOauth: KVStoreOptions = {
      mattermostUrl: <string>mattermostUrl,
      accessToken: <string>accessToken
   };
   const kvStoreClientOauth = new KVStoreClient(kvOptionsOauth);

   const acting_user = {
      id: userId
   }
   call.context = { ...call.context, acting_user }
   const message = 'webhook';

   const props = {
      app_bindings: [
         {
            location: "embedded",
            app_id: m.app_id,
            description: h6(`${'user'} commented on ${hyperlink(`${'file'}`, 'eventData.html_url')}`),
            bindings: [
               {
                  location: 'ActionsEvents.ACKNOWLEDGED_ALERT_BUTTON_EVENT',
                  label: 'Acknowledged',
                  submit: {
                     path: Routes.App.CallPathCommentReplay,
                     expand: {
                        oauth2_user: AppExpandLevels.EXPAND_SUMMARY,
                        oauth2_app: AppExpandLevels.EXPAND_SUMMARY,
                        post: AppExpandLevels.EXPAND_SUMMARY
                     },
                     state: {
                        //incident
                     }
                  }
               }
            ]
         }
      ]
   }
   await postBotChannel(call, message, props);
}