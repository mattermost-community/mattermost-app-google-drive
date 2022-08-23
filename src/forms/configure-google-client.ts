import {
    AppCallRequest,
    AppCallValues,
    AppField,
    AppForm,
    AppSelectOption,
    KVStoreOptions,
    KVStoreProps,
    Oauth2App,
    Oauth2Data,
} from '../types';
import { 
    AppFieldSubTypes,
    AppFieldTypes, 
    ConfigureClientForm, 
    GoogleDriveIcon, 
    modeConfiguration, 
    optConfigure, 
    Routes
} from '../constant';
import { 
    KVStoreClient, 
} from '../clients/kvstore';
import { hyperlink } from '../utils/markdown';
import manifest from '../manifest.json';

export async function googleClientConfigForm(call: AppCallRequest): Promise<AppForm> {
    const homepageUrl: string = manifest.homepage_url;
    const values: KVStoreProps = call.values as KVStoreProps;
    const oauth2App: Oauth2App = call.context.oauth2 as Oauth2App;

    const clientID = values?.google_drive_client_id || oauth2App?.client_id;
    const clientSecret = values?.google_drive_client_secret || oauth2App?.client_secret;
    const modeConfig = typeof values?.google_drive_mode == 'object'
        ? values?.google_drive_mode?.value 
        : oauth2App?.data?.google_drive_mode;
    const apiKey = values?.google_drive_api_key || oauth2App?.data?.google_drive_api_key;
    const saJson = values?.google_drive_service_account || oauth2App?.data?.google_drive_service_account;
    
    const defValue: AppSelectOption | undefined = modeConfiguration.find(mode => mode.value === modeConfig);

    const form: AppForm = {
        title: 'Configure Google Drive Client',
        header: `Create a new ${hyperlink('Google Drive', `${homepageUrl}#configuration`)} Client.`,
        icon: GoogleDriveIcon,
        fields: [
            {
                type: AppFieldTypes.TEXT,
                name: ConfigureClientForm.CLIENT_ID,
                modal_label: 'Client ID',
                value: clientID,
                description: 'API integration Google Client ID',
                is_required: true,
            },
            {
                type: AppFieldTypes.TEXT,
                subtype: AppFieldSubTypes.PASSWORD,
                name: ConfigureClientForm.CLIENT_SECRET,
                modal_label: 'Client Secret',
                value: clientSecret,
                description: 'API integration Google Client Secret',
                is_required: true,
            },
            {
                type: AppFieldTypes.STATIC_SELECT,
                name: ConfigureClientForm.MODE,
                modal_label: 'Service Account',
                value: defValue,
                description: 'What kind of Google service account to use to process incoming change notifications',
                is_required: true,
                refresh: true,
                options: modeConfiguration
            }
        ],
        submit: {
            path: Routes.App.CallPathConfigSubmit,
            expand: {}
        },
        source: {
            path: Routes.App.CallPathUpdateConfigForm,
        }
    };

    let extraField: AppField = {
        name: '',
        type: ''
    }
    switch (modeConfig) {
        case optConfigure.fAPIKey:
            extraField = {
                type: AppFieldTypes.TEXT,
                subtype: AppFieldSubTypes.PASSWORD,
                name: ConfigureClientForm.API_KEY,
                modal_label: 'API Key',
                value: apiKey,
                description: 'Google API Key for the Mattermost App, no need if using the serv.',
                is_required: true,
            };
            break;
        case optConfigure.fAccountJSON:
            extraField = {
                type: AppFieldTypes.TEXT,
                subtype: AppFieldSubTypes.TEXTAREA,
                max_length: 32 * 1024,
                name: ConfigureClientForm.SERVICE_ACCOUNT,
                modal_label: 'Service Account (JSON)',
                value: saJson,
                description: 'Google Service Account for the Mattermost App. Please open the downloaded credentials JSON file, and paste its contents here.',
                is_required: true,
            };
            break;
    
        default:
            break;
    }

    form.fields.push(extraField);


    return form;
}

export async function googleClientConfigFormSubmit(call: AppCallRequest): Promise<void> {
    const mattermostUrl: string | undefined = call.context.mattermost_site_url;
    const botAccessToken: string | undefined = call.context.bot_access_token;
    const values: AppCallValues = <any>call.values;

    const gClientID: string = values[ConfigureClientForm.CLIENT_ID];
    const gClientSecret: string = values[ConfigureClientForm.CLIENT_SECRET];
    const gconfigMode: AppSelectOption = values[ConfigureClientForm.MODE]?.value;
    const gSAJson: string = values[ConfigureClientForm.SERVICE_ACCOUNT];
    const gApiKey: string = values[ConfigureClientForm.API_KEY];

    const options: KVStoreOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>botAccessToken,
    };
    const kvStoreClient = new KVStoreClient(options);

    const config: Oauth2Data = {
        [ConfigureClientForm.MODE]: gconfigMode,
        [ConfigureClientForm.API_KEY]: gApiKey,
        [ConfigureClientForm.SERVICE_ACCOUNT]: gSAJson
    };
    const oauth2App: Oauth2App = {
        client_id: gClientID,
        client_secret: gClientSecret,
        data: config
    }
    
    await kvStoreClient.storeOauth2App(oauth2App);
    
}