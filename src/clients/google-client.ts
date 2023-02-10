import axios, { AxiosResponse } from 'axios';
import { Auth, docs_v1, drive_v3, driveactivity_v2, google, sheets_v4, slides_v1 } from 'googleapis';
import { head } from 'lodash';
import stream from 'stream';
var slice = require('stream-slice').slice;

import { Exception } from '../utils/exception';

import { ExceptionType, KVStoreGoogleData } from '../constant';
import { ExtendedAppCallRequest, KVGoogleData, KVGoogleUser, KVStoreOptions, Metadata_File, Oauth2App, Oauth2CurrentUser } from '../types';
import { configureI18n } from '../utils/translations';
import { tryPromise } from '../utils/utils';

import { KVStoreClient } from './kvstore';

export const getOAuthGoogleClient = async (call: ExtendedAppCallRequest): Promise<Auth.OAuth2Client> => {
    const oauth2App: Oauth2App = call.context.oauth2;
    const oAuth2Client = new google.auth.OAuth2(
        oauth2App.client_id,
        oauth2App.client_secret,
        oauth2App.complete_url,
    );

    return oAuth2Client;
};

export const getGoogleOAuth = async (call: ExtendedAppCallRequest): Promise<Auth.OAuth2Client> => {
    const i18nObj = configureI18n(call.context);

    const mattermostUrl: string = call.context.mattermost_site_url!;
    const botAccessToken: string = call.context.bot_access_token!;
    const actingUserId: string = call.context.acting_user.id!;
    let oauth2Token: Oauth2CurrentUser | undefined = call.context.oauth2?.user;

    if (!oauth2Token?.refresh_token) {
        const kvOptions: KVStoreOptions = {
            mattermostUrl,
            accessToken: botAccessToken,
        };
        const kvStoreClient = new KVStoreClient(kvOptions);
        const googleData: KVGoogleData = await kvStoreClient.kvGet(KVStoreGoogleData.GOOGLE_DATA);
        const kvGUser: KVGoogleUser | undefined = googleData?.userData?.find((user) => head(Object.keys(user)) === actingUserId);
        if (kvGUser) {
            oauth2Token = head(Object.values(kvGUser));
        }
    }

    if (!oauth2Token) {
        throw new Exception(ExceptionType.TEXT_ERROR, i18nObj.__('general.validation-user.oauth-user'), call);
    }

    const oauth2Client = await getOAuthGoogleClient(call);
    oauth2Client.setCredentials(oauth2Token);
    await tryPromise(oauth2Client.refreshAccessToken(), ExceptionType.MARKDOWN, i18nObj.__('general.google-error'), call);
    return oauth2Client;
};

export const getGoogleDriveClient = async (call: ExtendedAppCallRequest): Promise<drive_v3.Drive> => {
    const auth = await getGoogleOAuth(call);

    return google.drive({
        version: 'v3',
        auth,
    });
};

export const getGoogleDriveActivityClient = async (call: ExtendedAppCallRequest): Promise<driveactivity_v2.Driveactivity> => {
    const auth = await getGoogleOAuth(call);

    return google.driveactivity({
        version: 'v2',
        auth,
    });
};

export const getGoogleDocsClient = async (call: ExtendedAppCallRequest): Promise<docs_v1.Docs> => {
    const auth = await getGoogleOAuth(call);

    return google.docs({
        version: 'v1',
        auth,
    });
};

export const getGoogleSlidesClient = async (call: ExtendedAppCallRequest): Promise<slides_v1.Slides> => {
    const auth = await getGoogleOAuth(call);

    return google.slides({
        version: 'v1',
        auth,
    });
};

export const getGoogleSheetsClient = async (call: ExtendedAppCallRequest): Promise<sheets_v4.Sheets> => {
    const auth = await getGoogleOAuth(call);

    return google.sheets({
        version: 'v4',
        auth,
    });
};

//TODO: Make the file upload using multiple PUT request
export const uploadFilesGoogleClient = async (file: stream, metadata: Metadata_File, token: string): Promise<any> => {
    const url = "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable";
    return axios.post(url, { name: metadata.name }, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            'X-Upload-Content-Length': metadata.size,
            'X-Upload-Content-Type': "application/octet-stream"
        },
    }).then((response: AxiosResponse<any>) => {

        const fullSize = metadata.size;
        const byteSplit = (256 * 1024 * 2);

/*
        let readBytes = 0;
        file.on('data', (chunk) => {
            readBytes += chunk.length;
        });


        file.on('end', () => {
            console.log('All done.', readBytes, ' -> ', metadata.size);
        });
        */

        let readBytes = 0;
        const sliceFile: any = []

        //for (let index = 0; index < fullSize; index += byteSplit) {
        file.pipe(slice(0, 524288))
            .on('data', (data: any) => {
                readBytes += data.length;
                sliceFile.push(data);
            });

        file.on('end', () => {
            console.log('All done.', readBytes, ' -> ', metadata.size);
            console.log(sliceFile.length);
            const file = Buffer.from(new Int8Array(sliceFile))
            axios.put(response['headers'].location, file, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Range": `bytes 0-${524288}/${fullSize}`,
                    'Content-Type': "application/octet-stream",
                },
            }).then((response: AxiosResponse<any>) => {
                console.log('done');
                console.log(response.data);
            }).catch(err => console.log(err));
        });
            
        //}

        /*
        file.pipe(slice(0, byteSplit))
        .on('data', (data: any) => {
            axios.put(response['headers'].location, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Range": `bytes 0-${byteSplit}/${fullSize}`,
                    'Content-Type': "application/octet-stream",
                },
            }).then((response: AxiosResponse<any>) => {
                console.log(response.data);
            }).catch(err => console.log(err));
        });
        */

        /*
        for (let index = 0; index < fullSize + 1; index++) {
            const element = array[index];
            
        }
        */

        /*
        axios.put(response['headers'].location, file, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Range": `bytes 0-${metadata.size - 1}/${metadata.size}`,
                'Content-Type': "application/octet-stream",
            },
        }).then((response: AxiosResponse<any>) => {
            console.log(response.data);
        }).catch(err => console.log(err));
        */
        
    }).catch(err => console.log('err POST'));

}