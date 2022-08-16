import {
    AppCallRequest,
    AppCallValues,
    AppForm,
    KVStoreOptions,
    KVStoreProps,
} from '../types';
import { 
    AppFieldTypes, 
    ConfigureClientForm, 
    GoogleDriveIcon, 
    Routes, 
    StoreKeys 
} from '../constant';
import { 
    KVStoreClient, 
} from '../clients/kvstore';
import { hyperlink } from '../utils/markdown';
import manifest from '../manifest.json';

export async function googleClientConfigForm(call: AppCallRequest): Promise<AppForm> {
    const homepageUrl: string = manifest.homepage_url;
    const mattermostUrl: string | undefined = call.context.mattermost_site_url;
    const botAccessToken: string | undefined = call.context.bot_access_token;
    
    const options: KVStoreOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>botAccessToken,
    };
    const kvStoreClient = new KVStoreClient(options);

    const config: KVStoreProps = await kvStoreClient.kvGet(StoreKeys.config);
    

    const form: AppForm = {
        title: 'Configure Google Drive Client',
        header: `Create a new ${hyperlink('Google Drive', `${homepageUrl}#configuration`)} Client.`,
        icon: GoogleDriveIcon,
        fields: [
            {
                type: AppFieldTypes.TEXT,
                name: ConfigureClientForm.CLIENT_ID,
                modal_label: 'Client ID',
                value: config.google_drive_client_id,
                description: 'API integration Google Client ID',
                is_required: true,
            },
            {
                type: AppFieldTypes.TEXT,
                name: ConfigureClientForm.CLIENT_SECRET,
                modal_label: 'Client Secret',
                value: config.google_drive_client_secret,
                description: 'API integration Google Client Secret',
                is_required: true,
            }
        ],
        submit: {
            path: Routes.App.CallPathConfigSubmit,
            expand: {}
        },
    };
    return form;
}

export async function googleClientConfigFormSubmit(call: AppCallRequest): Promise<void> {
    const mattermostUrl: string | undefined = call.context.mattermost_site_url;
    const botAccessToken: string | undefined = call.context.bot_access_token;
    const values: AppCallValues = <any>call.values;

    const gClientID: string = values[ConfigureClientForm.CLIENT_ID];
    const gClientSecret: string = values[ConfigureClientForm.CLIENT_SECRET];

    const options: KVStoreOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>botAccessToken,
    };
    const kvStoreClient = new KVStoreClient(options);

    const config: KVStoreProps = {
        google_drive_client_id: gClientID,
        google_drive_client_secret: gClientSecret
    };
    await kvStoreClient.kvSet(StoreKeys.config, config);
}