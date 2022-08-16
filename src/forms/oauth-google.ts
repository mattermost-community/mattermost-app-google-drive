import {
    AppCallRequest, 
    KVStoreOptions, 
    KVStoreProps,
} from '../types';
import { KVStoreClient } from '../clients/kvstore';
import { StoreKeys } from '../constant';
import { getGoogleOAuthScopes } from '../utils/oauth-scopes';
const { google } = require('googleapis');

export async function oAuth2Connect(call: AppCallRequest): Promise<string> {
    const mattermostUrl: string | undefined = call.context.mattermost_site_url;
    const botAccessToken: string | undefined = call.context.bot_access_token;
    const oauth2CompleteUrl: string | undefined = call.context.oauth2?.complete_url;

    const kvOptions: KVStoreOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>botAccessToken
    };
    const kvStoreClient = new KVStoreClient(kvOptions);
    const kvStoreProps: KVStoreProps = await kvStoreClient.kvGet(StoreKeys.config);

    const oauth2Client = new google.auth.OAuth2(
        kvStoreProps.google_drive_client_id,
        kvStoreProps.google_drive_client_secret,
        oauth2CompleteUrl
    );

    const scopes = getGoogleOAuthScopes();

    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
}
