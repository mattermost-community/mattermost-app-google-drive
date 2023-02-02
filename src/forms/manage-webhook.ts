import { drive_v3 } from 'googleapis';
import { head } from 'lodash';
import moment from 'moment';

import { logger } from '../utils/logger';

import { getGoogleDriveActivityClient, getGoogleDriveClient } from '../clients/google-client';
import { ExceptionType } from '../constant';
import GeneralConstants from '../constant/general';
import { GoogleResourceState } from '../constant/google-kinds';
import { AppActingUser, Change, ChangeList, GA$Comment, GA$DriveActivity, GA$PermissionDetails, GA$QueryDriveActivityResponse, KVGoogleData, KVGoogleUser, KVStoreOptions, Schema$File, StartPageToken, WebhookRequest } from '../types';
import { tryPromise } from '../utils/utils';

import { manageCommentOnFile } from './webhook-notifications/comments';
import { permissionsChanged } from './webhook-notifications/permissions-change';

export async function manageWebhookCall(call: WebhookRequest): Promise<void> {
    if (call.values.headers['X-Goog-Resource-State'] !== GoogleResourceState.CHANGE) {
        logger.error({ message: "Returned: Resource state wasn't change", siteUrl: call.context.mattermost_site_url, requestPath: call.context.app_path });
        return;
    }
    const paramsd = new URLSearchParams(call.values.rawQuery);
    const userId: string | null = paramsd.get('userId');
    if (!userId) {
        logger.error({ message: 'Returned: Not userId found', siteUrl: call.context.mattermost_site_url, requestPath: call.context.app_path });
        return;
    }
    const acting_user = {
        id: userId,
    } as AppActingUser;
    call.context = { ...call.context, acting_user };

    const drive: drive_v3.Drive = await getGoogleDriveClient(call);
    const pageToken = await tryPromise<StartPageToken>(drive.changes.getStartPageToken(), ExceptionType.TEXT_ERROR, 'Google failed: ', call);
    const params = {
        pageToken: (Number(pageToken?.startPageToken) - GeneralConstants.REMOVE_ONE).toString(),
        fields: '*',
    };

    const list = await tryPromise<ChangeList>(drive.changes.list(params), ExceptionType.TEXT_ERROR, 'Google failed: ', call);
    const lastChange: Change | undefined = head(list.changes);
    const file: Schema$File | undefined = lastChange?.file;
    if (!file) {
        logger.error({ message: 'Returned: Not file found', siteUrl: call.context.mattermost_site_url, requestPath: call.context.app_path });
        return;
    }

    if (Boolean(file.lastModifyingUser?.me)) {
        logger.error({ message: 'Returned: Owner of action did this', siteUrl: call.context.mattermost_site_url, requestPath: call.context.app_path });
        return;
    }

    const modifiedTime = moment(file?.modifiedTime);
    const lastChangeTime = moment(lastChange?.time);
    const viewedByMeTime = moment(file?.viewedByMeTime);

    // When a user sees a file, the file also changes, even if no action was performed
    if (lastChangeTime.diff(modifiedTime, 'seconds') > lastChangeTime.diff(viewedByMeTime, 'seconds')) {
        logger.error({ message: 'Returned: User opened file', siteUrl: call.context.mattermost_site_url, requestPath: call.context.app_path });
        return;
    }

    const activityClient = await getGoogleDriveActivityClient(call);
    const paramsActivity = {
        pageSize: GeneralConstants.PAGE_ONE,
        itemName: `items/${file.id}`,
    };

    const activityRes: GA$QueryDriveActivityResponse = await tryPromise<GA$QueryDriveActivityResponse>(activityClient.activity.query({ requestBody: paramsActivity }), ExceptionType.TEXT_ERROR, 'Google failed: ', call);
    const activity: GA$DriveActivity | undefined = head(activityRes?.activities);

    if (!activity) {
        logger.error({ message: 'Returned: Not activity was found', siteUrl: call.context.mattermost_site_url, requestPath: call.context.app_path });
        return;
    }

    const permission: GA$PermissionDetails | undefined = activity.primaryActionDetail?.permissionChange;
    if (permission) {
        await permissionsChanged(call, file, activity);
    }

    const comment: GA$Comment | undefined = activity.primaryActionDetail?.comment;
    if (comment) {
        await manageCommentOnFile(call, file, activity);
    }
}

