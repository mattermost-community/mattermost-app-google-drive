import {MattermostClient} from '../clients';
import {getGoogleDriveClient} from '../clients/google-client';
import {ExceptionType, GooglePermissionRoleByOption, optFileShare} from '../constant';
import {AppCallRequest, ChannelMember, MattermostOptions, Schema$File, User} from '../types';
import {CreateFileForm} from '../types/forms';
import {configureI18n} from '../utils/translations';
import {tryPromise} from '../utils/utils';

export const SHARE_FILE_ACTIONS: { [key: string]: Function } = {
    [optFileShare.notShare]: actNotShare,
    [optFileShare.sAView]: shareWithAnyone,
    [optFileShare.sAComment]: shareWithAnyone,
    [optFileShare.sAEdit]: shareWithAnyone,

    [optFileShare.sCView]: shareWithChannel,
    [optFileShare.sCComment]: shareWithChannel,
    [optFileShare.sCEdit]: shareWithChannel,
};

async function actNotShare(call: AppCallRequest, file: Schema$File, channelId: string,): Promise<void> {

}

async function shareWithAnyone(call: AppCallRequest, file: Schema$File, channelId: string,): Promise<void> {
    const i18nObj = configureI18n(call.context);

    const values = call.values as CreateFileForm;
    const role = GooglePermissionRoleByOption[values.google_file_access.value];
    const drive = await getGoogleDriveClient(call);

    const body = {
        fileId: <string>file.id,
        requestBody: {
            role,
            type: 'anyone',
        },
    };
    return await tryPromise<any>(drive.permissions.create(body), ExceptionType.TEXT_ERROR, i18nObj.__('general.google-error'));
}

async function shareWithChannel(call: AppCallRequest, file: Schema$File, channelId: string,): Promise<void> {
    const i18nObj = configureI18n(call.context);

    const mattermostUrl: string | undefined = call.context.mattermost_site_url;
    const userAccessToken: string | undefined = call.context.acting_user_access_token;
    const values = call.values as CreateFileForm;
    const role = GooglePermissionRoleByOption[values.google_file_access.value];
    const drive = await getGoogleDriveClient(call);

    const mattermostOpts: MattermostOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>userAccessToken,
    };
    const mmClient: MattermostClient = new MattermostClient(mattermostOpts);

    const membersOfChannel: ChannelMember[] = await mmClient.getChannelMembers(channelId);
    const userIDs = membersOfChannel.map((user) => user.user_id);
    const users: User[] = await mmClient.getUsersById(userIDs);
    for (let index = 0; index < users.length; index++) {
        const user = users[index];
        if (user.is_bot) {
            return;
        }

        const body = {
            fileId: <string>file.id,
            requestBody: {
                role,
                type: 'user',
                emailAddress: user.email,
                sendNotificationEmail: true,
            },
        };
        await tryPromise<any>(drive.permissions.create(body), ExceptionType.TEXT_ERROR, i18nObj.__('general.google-error'));
    }
}

