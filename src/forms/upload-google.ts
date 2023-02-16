import stream from 'stream';

import { AppSelectOption } from '@mattermost/types/lib/apps';
import { head, replace } from 'lodash';

import { MattermostClient } from '../clients';
import { getGoogleDriveClient } from '../clients/google-client';
import { AppExpandLevels, AppFieldTypes, ExceptionType, FilesToUpload, GoogleDriveIcon, Routes } from '../constant';
import { ExpandAppField, ExpandAppForm, ExtendedAppCallRequest, MattermostOptions, Metadata_File, PostCreate, PostResponse, Schema$File, Schema$User } from '../types';
import { SelectedUploadFilesForm } from '../types/forms';
import { configureI18n } from '../utils/translations';
import { routesJoin, throwException, tryPromise, tryPromiseMattermost } from '../utils/utils'; 


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
    const fileMetadata = Post.metadata.files;

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
    const drive = await getGoogleDriveClient(call);
    const promiseArray: Promise<Schema$File>[] = [];

    for (let index = 0; index < fileIds.length; index++) {
        const metadata = filesMetadata[index];

        if (!saveFiles.includes(metadata.id)) {
            continue;
        }

        const writer = fs.createWriteStream(metadata.name);

        const here = await mmClient.getFileUploaded(metadata.id).then(response => {

            //ensure that the user can call `then()` only when the file has
            //been downloaded entirely.

            return new Promise((resolve, reject) => {
                response.data.pipe(writer);
                let error: any = null;
                writer.on('error', (err: any) => {
                    error = err;
                    writer.close();
                    reject(err);
                });
                writer.on('close', () => {
                    console.log('close');
                    if (!error) {
                        resolve(true);
                    }
                });

            });
        });

        //writer.write('GeeksforGeeks');
        const chunk = fs.createReadStream(metadata.name);
        chunk.pipe(writer);
        const fileMetadata = {
            name: 'photo.jpg',
        };
        const media = {
            mimeType: metadata.mime_type,
            body: chunk,
        };
        try {
            const file = await drive.files.create({
                media: media,
                fields: 'id,name,webViewLink,iconLink,owners,createdTime',
                requestBody: {
                    name: metadata.name,
                },
            });
            
        } catch (err) {
            // TODO(developer) - Handle error
            throw err;
        }

    }
    
    return 'message';
}


var XMLHttpRequest = require('xhr2');
import { Blob } from 'node:buffer';
const fs = require('fs');

const getFile = async (mattermostOpts: MattermostOptions, metadata: Metadata_File, drive: any) => {
    const url = routesJoin([mattermostOpts.mattermostUrl, Routes.MM.ApiVersionV4, Routes.MM.FilePath]);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', replace(url, Routes.PV.Identifier, metadata.id), true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + mattermostOpts.accessToken);
    xhr.responseType = 'blob';

    xhr.onload = async function (e: any) {
        if (this.status == 200) {
            console.log(this.status);
            var data = this.response.pipe
            const { resp } = await drive.files.create({
                media: {
                    mimeType: metadata.mime_type,
                    body: data,
                },
                requestBody: {
                    name: metadata.name,
                },
                fields: 'id,name,webViewLink,iconLink,owners,createdTime',
            });
            return resp;
            console.log(data);
            //console.log(file);
        }
    };

    xhr.send();
}
/*

async function resumableUpload() {
    const accessToken = localStorage.getItem("accessToken");
    const file = document.getElementById("file").files[0];
    const fileObj = await getData(file);
    if (Object.keys(fileObj).length == 0) {
        console.log("No file.");
        return;
    }

    // 1. Create the session for the resumable upload..
    const metadata = { mimeType: fileObj.mimeType, name: fileObj.filename };
    $.ajax({
        type: "POST",
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", "Bearer" + " " + accessToken);
            request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        },
        url: "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
        success: function (data, _, r) {
            const location = r.getResponseHeader("location");

            // 2. Upload the data using the retrieved endpoint.
            $.ajax({
                type: "PUT",
                beforeSend: function (request) {
                    request.setRequestHeader("Content-Range", `bytes 0-${fileObj.fileSize - 1}\/${fileObj.fileSize}`);
                },
                url: location,
                success: function (data) {
                    console.log(data)
                },
                error: function (error) {
                    console.log(error);
                },
                async: true,
                data: fileObj.data,
                cache: false,
                processData: false,
                timeout: 60000
            });

        },
        error: function (error) {
            console.log(error);
        },
        async: true,
        data: JSON.stringify(metadata),
        cache: false,
        processData: false,
        timeout: 60000
    });
}  
*/