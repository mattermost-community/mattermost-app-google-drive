import {
    AppCallRequest, 
    AppCallValues, 
    Channel, 
    GoogleToken, 
    GoogleTokenResponse, 
    KVStoreOptions, 
    KVStoreProps,
    MattermostOptions,
    Oauth2CurrentUser,
    PostCreate,
} from '../types';
import { KVStoreClient } from '../clients/kvstore';
import { StoreKeys } from '../constant';
import { getGoogleOAuthScopes } from '../utils/oauth-scopes';
import { MattermostClient } from '../clients';
const { google } = require('googleapis');

export async function oAuth2Connect(call: AppCallRequest): Promise<string> {
    const mattermostUrl: string | undefined = call.context.mattermost_site_url;
    const botAccessToken: string | undefined = call.context.bot_access_token;
    const oAuth2CompleteUrl: string | undefined = call.context.oauth2?.complete_url;
    const state: string | undefined = call.values?.state;
    
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

    const scopes = getGoogleOAuthScopes();

    return oAuth2Client.generateAuthUrl({
        scope: scopes,
        state: state
    });
}

export async function oAuth2Complete(call: AppCallRequest): Promise<void> {
    const mattermostUrl: string | undefined = call.context.mattermost_site_url;
    const botAccessToken: string | undefined = call.context.bot_access_token;
    const accessToken: string | undefined = call.context.acting_user_access_token;
    const botUserID: string | undefined = call.context.bot_user_id;
    const actingUserID: string | undefined = call.context.acting_user?.id;
    const oAuth2CompleteUrl: string | undefined = call.context.oauth2?.complete_url;
    const values: AppCallValues | undefined = call.values;

    if (!values?.code) {
        throw new Error(values?.error_description || 'Bad Request: code param not provided');
    }

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

    const tokenBody: GoogleTokenResponse = await oAuth2Client.getToken(values?.code);
   
    const kvOptionsOauth: KVStoreOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>accessToken
    };
    const kvStoreClientOauth = new KVStoreClient(kvOptionsOauth);

    const storedToken: Oauth2CurrentUser = {
        token: tokenBody.tokens
    };
    await kvStoreClientOauth.storeOauth2User(storedToken);

    const mattermostOption: MattermostOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>botAccessToken
    };
    const mattermostClient: MattermostClient = new MattermostClient(mattermostOption);
    const channel: Channel = await mattermostClient.createDirectChannel([<string>botUserID, <string>actingUserID]);
    const post: PostCreate = {
        message: 'You have successfully connected your Google account!',
        user_id: <string>actingUserID,
        channel_id: channel.id
    };
    await mattermostClient.createPost(post);
}