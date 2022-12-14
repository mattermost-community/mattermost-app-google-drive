import { head } from 'lodash';

import { getGoogleDriveClient, getOAuthGoogleClient } from '../clients/google-client';
import { KVStoreClient } from '../clients/kvstore';
import { ExceptionType, GoogleConstants, KVStoreGoogleData, Routes } from '../constant';
import GeneralConstants from '../constant/general';
import { AppCallRequest, AppCallValues, GoogleTokenResponse, KVGoogleData, KVGoogleUser, KVStoreOptions, Oauth2App, Oauth2CurrentUser, Schema$About, StandardParameters } from '../types';
import { callBindingByApp } from '../utils/call-binding';
import { Exception } from '../utils/exception';
import { hyperlink } from '../utils/markdown';
import { getGoogleOAuthScopes } from '../utils/oauth-scopes';
import { postBotChannel } from '../utils/post-in-channel';
import { configureI18n } from '../utils/translations';
import { isConnected, tryPromise } from '../utils/utils';

const { google } = require('googleapis');

export async function getConnectLink(call: AppCallRequest): Promise<string> {
    const connectUrl: string = call.context.oauth2?.connect_url as string;
    const oauth2: Oauth2App | undefined = call.context.oauth2 as Oauth2App;
    const i18nObj = configureI18n(call.context);
    const link = hyperlink('link', connectUrl);

    const message: string = isConnected(oauth2) ?
        i18nObj.__('connect-binding.response.alreadyLoggedIn') :
        i18nObj.__('connect-binding.response.generateLink', { link });
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
        state,
        access_type: GoogleConstants.OFFLINE,
        prompt: GoogleConstants.CONSENT,
    });
}

export async function oAuth2Complete(call: AppCallRequest): Promise<void> {
    const mattermostUrl: string | undefined = call.context.mattermost_site_url;
    const botAccessToken: string | undefined = call.context.bot_access_token;
    const accessToken: string | undefined = call.context.acting_user_access_token;
    const userID: string | undefined = call.context.acting_user?.id;
    const values: AppCallValues | undefined = call.values;
    const i18nObj = configureI18n(call.context);

    if (!values?.code) {
        throw new Error(values?.error_description || i18nObj.__('connect-binding.response.codeNotProvided'));
    }

    const oAuth2Client = await getOAuthGoogleClient(call);
    const tokenBody: GoogleTokenResponse = await oAuth2Client.getToken(values?.code);
    const oauth2Token: Oauth2CurrentUser = {
        refresh_token: <string>tokenBody.tokens?.refresh_token,
    };

    call.context.oauth2 = {
        ...call.context.oauth2,
        user: oauth2Token,
    };

    const drive = await getGoogleDriveClient(call);
    const aboutParams: StandardParameters = {
        fields: `${GoogleConstants.USER}`,
    };
    const aboutUser = await tryPromise<Schema$About>(drive.about.get(aboutParams), ExceptionType.TEXT_ERROR, i18nObj.__('general.google-error'));

    const storedToken: Oauth2CurrentUser = {
        refresh_token: <string>tokenBody.tokens?.refresh_token,
        user_email: <string>aboutUser.user.emailAddress,
    };

    const kvOptionsOauth: KVStoreOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>accessToken,
    };
    const kvStoreClientOauth = new KVStoreClient(kvOptionsOauth);
    await kvStoreClientOauth.storeOauth2User(storedToken);

    const kvOptions: KVStoreOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>botAccessToken,
    };
    const kvStoreClient = new KVStoreClient(kvOptions);
    const kvGoogleData: KVGoogleData = await kvStoreClient.kvGet(KVStoreGoogleData.GOOGLE_DATA);
    const googleUser: KVGoogleUser = {
        [<string>userID]: storedToken,
    };
    const googleData: KVGoogleData = {
        userData: Boolean(kvGoogleData?.userData?.length) ? kvGoogleData.userData : [],
    };
    googleData.userData.push(googleUser);
    await kvStoreClient.kvSet(KVStoreGoogleData.GOOGLE_DATA, googleData);

    const message = i18nObj.__('connect-binding.response.success');
    await postBotChannel(call, message);
    await callBindingByApp(call, Routes.App.CallPathStartNotifications);
}

export async function oAuth2Disconnect(call: AppCallRequest): Promise<void> {
    const mattermostUrl: string | undefined = call.context.mattermost_site_url;
    const accessToken: string | undefined = call.context.acting_user_access_token;
    const botAccessToken: string | undefined = call.context.bot_access_token;
    const userID: string | undefined = call.context.acting_user?.id;
    const oauth2: Oauth2App | undefined = call.context.oauth2 as Oauth2App;
    const i18nObj = configureI18n(call.context);

    if (!isConnected(oauth2)) {
        throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('disconnect-binding.response.noSession'));
    }

    const kvOptionsOauth: KVStoreOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>accessToken,
    };
    const kvStoreClientOauth = new KVStoreClient(kvOptionsOauth);
    await kvStoreClientOauth.storeOauth2User({});

    const kvOptions: KVStoreOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>botAccessToken,
    };
    const kvStoreClient = new KVStoreClient(kvOptions);

    const googleData: KVGoogleData = await kvStoreClient.kvGet(KVStoreGoogleData.GOOGLE_DATA);
    const remove = googleData?.userData?.findIndex((user) => head(Object.keys(user)) === <string>userID);
    if (remove >= GeneralConstants.HAS_VALUE) {
        googleData.userData.splice(remove, GeneralConstants.REMOVE_ONE);
    }
    await kvStoreClient.kvSet(KVStoreGoogleData.GOOGLE_DATA, googleData);

    const message = i18nObj.__('disconnect-binding.response.success');
    await postBotChannel(call, message);
}
