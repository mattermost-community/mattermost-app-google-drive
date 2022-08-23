import {
    AppCallRequest, 
    AppCallValues, 
    Channel, 
    GoogleTokenResponse, 
    KVStoreOptions, 
    KVStoreProps,
    MattermostOptions,
    Oauth2App,
    Oauth2CurrentUser,
    PostCreate,
} from '../types';
import { KVStoreClient } from '../clients/kvstore';
import { ExceptionType, StoreKeys } from '../constant';
import { getGoogleOAuthScopes } from '../utils/oauth-scopes';
import { MattermostClient } from '../clients';
import { isConnected } from '../utils/utils';
import { hyperlink } from '../utils/markdown';
import { Exception } from '../utils/exception';
import { postBotChannel } from '../utils/post-in-channel';
const { google } = require('googleapis');

export async function getConnectLink(call: AppCallRequest): Promise<string> {
    const connectUrl: string = call.context.oauth2?.connect_url as string;
    const oauth2: Oauth2App | undefined = call.context.oauth2 as Oauth2App;
    const message: string = isConnected(oauth2)
        ? `You are already logged into Google`
        : `Follow this ${hyperlink('link', connectUrl)} to connect Mattermost to your Google Account.`;
    return message;
}

export async function oAuth2Connect(call: AppCallRequest): Promise<string> {
    const oauth2App: Oauth2App = call.context.oauth2 as Oauth2App;
    const state: string = call.values?.state as string;

    const oAuth2Client = new google.auth.OAuth2(
        oauth2App.client_id,
        oauth2App.client_secret,
        oauth2App?.complete_url
    );

    const scopes = getGoogleOAuthScopes();

    return oAuth2Client.generateAuthUrl({
        scope: scopes,
        state: state
    });
}

export async function oAuth2Complete(call: AppCallRequest): Promise<void> {
    const oauth2App: Oauth2App = call.context.oauth2 as Oauth2App;
    const mattermostUrl: string | undefined = call.context.mattermost_site_url;
    const accessToken: string | undefined = call.context.acting_user_access_token;
    const values: AppCallValues | undefined = call.values;

    if (!values?.code) {
        throw new Error(values?.error_description || 'Bad Request: code param not provided');
    }

    const oAuth2Client = new google.auth.OAuth2(
        oauth2App.client_id,
        oauth2App.client_secret,
        oauth2App.complete_url
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

    const message = 'You have successfully connected your Google account!';
    await postBotChannel(call, message);
}

export async function oAuth2Disconnect(call: AppCallRequest): Promise<void> {
    const mattermostUrl: string | undefined = call.context.mattermost_site_url;
    const accessToken: string | undefined = call.context.acting_user_access_token;
    const oauth2: Oauth2App | undefined = call.context.oauth2 as Oauth2App;
    
    if (!isConnected(oauth2)) {
        throw new Exception(ExceptionType.MARKDOWN, 'Impossible to disconnet. There is no active session');
    }

    const kvOptionsOauth: KVStoreOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>accessToken
    };
    const kvStoreClientOauth = new KVStoreClient(kvOptionsOauth);
    await kvStoreClientOauth.storeOauth2User({});

    const message = 'You have successfully disconnected your Google account!';
    await postBotChannel(call, message);
}