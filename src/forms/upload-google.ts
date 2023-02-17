import stream from 'stream';

import { AppSelectOption } from '@mattermost/types/lib/apps';
import { head } from 'lodash';

import { MattermostClient } from '../clients';
import { getGoogleDriveClient, getGoogleOAuth, sendFileData, sendFirstFileRequest } from '../clients/google-client';
import { AppExpandLevels, AppFieldTypes, ExceptionType, FilesToUpload, GoogleDriveIcon, Routes } from '../constant';
import { ExpandAppField, ExpandAppForm, ExtendedAppCallRequest, MattermostOptions, PostCreate, PostResponse, PostResumableHeaders, Schema$File, Schema$User } from '../types';
import { SelectedUploadFilesForm } from '../types/forms';
import { configureI18n } from '../utils/translations';
import { routesJoin, throwException, tryPromise, tryPromiseMattermost } from '../utils/utils'; 
import { Exception } from '../utils/exception';
import moment from 'moment';

const maxSize = 5242880;

export async function uploadFileConfirmationCall(call: ExtendedAppCallRequest): Promise<ExpandAppForm> {
    const i18nObj = configureI18n(call.context);

    const mattermostUrl: string = call.context.mattermost_site_url!;
    const userAccessToken: string = call.context.acting_user_access_token!;
    const postId: string = call.context.post?.id as string;

    const mattermostOpts: MattermostOptions = {
        mattermostUrl,
        accessToken: userAccessToken,
    };
    const mmClient: MattermostClient = new MattermostClient(mattermostOpts);

    const Post: PostResponse = await tryPromiseMattermost<PostResponse>(mmClient.getPost(postId), ExceptionType.TEXT_ERROR, i18nObj.__('general.mattermost-error'), call);

    const fileIds = Post.file_ids;
    if (!fileIds || !fileIds.length) {
        throwException(ExceptionType.MARKDOWN, i18nObj.__('upload-google.confirmation-call.error-upload'), call);
    }
    // Added this validation, only files under 5MB could be uploaded (by this release)
    const fileMetadata = Post.metadata.files//.filter(singleFile => singleFile.size <= maxSize);
    if (!fileMetadata.length) {
        throwException(ExceptionType.MARKDOWN, i18nObj.__('upload-google.confirmation-call.description', { maxSize: '5MB' }), call);
    }

    const options: AppSelectOption[] = fileMetadata.map((file) => {
        return {
            label: file.name,
            value: file.id,
        };
    });

    const fields: ExpandAppField[] = [
        {
            type: AppFieldTypes.STATIC_SELECT,
            name: FilesToUpload.FILES,
            modal_label: i18nObj.__('upload-google.confirmation-call.label-modal'),
            options,
            multiselect: true,
            is_required: true,
            description: i18nObj.__('upload-google.confirmation-call.description', { maxSize: '5MB'}),
        },
    ];

    return {
        title: i18nObj.__('upload-google.confirmation-call.title'),
        icon: GoogleDriveIcon,
        fields,
        submit: {
            path: Routes.App.CallPathSaveFileSubmit,
            expand: {
                acting_user: AppExpandLevels.EXPAND_SUMMARY,
                acting_user_access_token: AppExpandLevels.EXPAND_ALL,
                oauth2_app: AppExpandLevels.EXPAND_ALL,
                oauth2_user: AppExpandLevels.EXPAND_ALL,
                post: AppExpandLevels.EXPAND_SUMMARY,
            },
        },
    } as ExpandAppForm;
}

export async function uploadFileConfirmationSubmit(call: ExtendedAppCallRequest): Promise<string> {
    const i18nObj = configureI18n(call.context);

    const mattermostUrl: string = call.context.mattermost_site_url as string;
    const userAccessToken: string = call.context.acting_user_access_token as string;
    const postId: string = call.context.post?.id as string;
    const channelId: string = call.context.post?.channel_id as string;
    const values = call.values as SelectedUploadFilesForm;
    const saveFiles = values.upload_file_google_drive.map((val) => val.value);

    const mattermostOpts: MattermostOptions = {
        mattermostUrl,
        accessToken: userAccessToken,
    };
    const mmClient: MattermostClient = new MattermostClient(mattermostOpts);

    const post: PostResponse = await tryPromiseMattermost<PostResponse>(mmClient.getPost(postId), ExceptionType.TEXT_ERROR, i18nObj.__('general.mattermost-error'), call);

    const fileIds = post.file_ids;
    const filesMetadata = post.metadata?.files;
    const auth = await getGoogleOAuth(call);
    const { token } = await auth.getAccessToken();

    if (!token) {
        throw new Exception(ExceptionType.TEXT_ERROR, i18nObj.__('general.validation-user.oauth-user'), call);
    }

    const promiseArray: Promise<Schema$File[]>[] = [];
    const googleToken = token;
    let hasSizeBigger = false;

    for (let index = 0; index < fileIds.length; index++) {
        const metadata = filesMetadata[index];

        if (!saveFiles.includes(metadata.id)) {
            continue;
        }

        if (metadata.size > maxSize) {
            hasSizeBigger = true;
            continue;
        }

        const fileReq: PostResumableHeaders = await sendFirstFileRequest(metadata, googleToken);
        const location = fileReq.location;
        const uploadFileRequest = new Promise<Schema$File[]>((res, rej) => {
            return mmClient.getFileUploaded(metadata.id).then(async (response) => {
                const fullSize = metadata.size;
                const step = fullSize; // This needs to be used a step, instead of full length
                let start = 0;

                const sendChunkReq: any[] = [];

                function getChunk(): void {
                    var data = response.read(step);
                    if (data != null) {
                        const startByte = start;
                        const endByte = startByte + step > fullSize ? fullSize : startByte + step;
                        sendChunkReq.push(sendFileData(location, startByte, endByte, metadata, googleToken, data), startByte, endByte);
                        start += step;
                        setImmediate(getChunk);
                    }
                }

                response.on('readable', getChunk);

                response.on('end', async function () {
                    const sendChunkRes = await Promise.all(sendChunkReq);
                    const fileData: Schema$File[] = sendChunkRes.filter((val) => typeof val === 'object');
                    res(fileData);
                });
            });
        });
        promiseArray.push(uploadFileRequest);
    }

    const promiseAwait = await Promise.all(promiseArray);
    const attachments = promiseAwait.flat().map((fileUp: Schema$File) => {
        const owner: Schema$User | undefined = head(fileUp.owners);
        return {
            author_name: `${owner?.displayName}`,
            author_icon: `${owner?.photoLink}`,
            title: `${fileUp.name}`,
            title_link: `${fileUp.webViewLink}`,
            footer: i18nObj.__('upload-google.confirmation-submit.footer', { date: moment(fileUp?.createdTime).format('MMM Do, YYYY') }),
            footer_icon: `${fileUp.iconLink}`,
        };
    });

    const extra = hasSizeBigger ? i18nObj.__('upload-google.confirmation-call.description', { maxSize: '5MB' }) : '';
    
    const message = attachments.length > 1 ?
        i18nObj.__('upload-google.confirmation-submit.multiple-files', { extra }) :
        i18nObj.__('upload-google.confirmation-submit.single-file', { extra })

    const postCreate: PostCreate = {
        message,
        channel_id: channelId,
        props: {
            attachments,
        },
        root_id: postId,
    };

    await tryPromiseMattermost<PostResponse>(mmClient.createPost(postCreate), ExceptionType.TEXT_ERROR, i18nObj.__('general.mattermost-error'), call);

    return message;
}
