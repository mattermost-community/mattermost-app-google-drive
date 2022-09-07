import { MattermostClient } from "../clients";
import { 
   getGoogleDocsClient, 
   getGoogleDriveClient, 
   getGoogleSheetsClient, 
   getGoogleSlidesClient
} from "../clients/google-client";
import { 
   AppExpandLevels,
   AppFieldSubTypes, 
   AppFieldTypes, 
   CreateGoogleDocument, 
   ExceptionType, 
   GoogleDriveIcon, 
   notShareFileOnChannel, 
   Routes, 
   shareFileOnChannel
} from "../constant";
import { 
   AppCallRequest, 
   AppField, 
   AppForm,
   Channel,
   MattermostOptions,
   Params$Resource$Files$Get,
   PostCreate,
   Schema$Document,
   Schema$File,
   Schema$Presentation,
   Schema$Spreadsheet,
   Schema$User,
} from "../types";
import { 
   CreateFileForm 
} from "../types/forms";
import { tryPromise } from "../utils/utils";
import { head } from "lodash";
import moment from "moment";


export async function createGoogleDocForm(call: AppCallRequest): Promise<AppForm> {

   const values = call.values as CreateFileForm;
   const fields: AppField[] = [
      {
         type: AppFieldTypes.TEXT,
         name: CreateGoogleDocument.TITLE,
         modal_label: `Title (optional)`,
         is_required: false,
         value: values?.google_file_title,
      },
   ];

   if (!!values?.google_file_will_share) {
      fields.push(
         {
            type: AppFieldTypes.TEXT,
            subtype: AppFieldSubTypes.TEXTAREA,
            max_length: 32 * 1024,
            name: CreateGoogleDocument.MESSAGE,
            modal_label: 'Message (optional)',
            placeholder: `Add a message, if you'd like.`,
            is_required: false,
         }
      );
   }

   fields.push(
      {
         type: AppFieldTypes.STATIC_SELECT,
         name: CreateGoogleDocument.FILE_ACCESS,
         modal_label: 'File Access',
         value: values?.google_file_access,
         description: 'Select who has access to the file',
         is_required: true,
         options: values?.google_file_will_share ? shareFileOnChannel : notShareFileOnChannel
      },
      {
         modal_label: ' ',
         type: AppFieldTypes.BOOL,
         name: CreateGoogleDocument.WILL_SHARE,
         is_required: false,
         refresh: true,
         hint: 'Share on this channel',
         value: values?.google_file_will_share,
      }
   );

   return {
      title: 'Create a Google Document',
      icon: GoogleDriveIcon,
      fields: fields,
      submit: {
         path: Routes.App.CallPathCreateDocumentSubmit,
         expand: {
            acting_user: AppExpandLevels.EXPAND_ALL,
            acting_user_access_token: AppExpandLevels.EXPAND_ALL,
            oauth2_app: AppExpandLevels.EXPAND_SUMMARY,
            oauth2_user: AppExpandLevels.EXPAND_SUMMARY,
            channel: AppExpandLevels.EXPAND_SUMMARY,
         }
      },
      source: {
         path: Routes.App.CallPathUpdateDocumentForm,
      }
   } as AppForm;
}

export async function createGoogleDocSubmit(call: AppCallRequest): Promise<any> {
   const mattermostUrl: string | undefined = call.context.mattermost_site_url;
   const userAccessToken: string | undefined = call.context.acting_user_access_token;
   const actingUserID: string | undefined = call.context.acting_user?.id;
   const botUserID: string | undefined = call.context.bot_user_id;
   const values = call.values as CreateFileForm; 

   const mattermostOpts: MattermostOptions = {
      mattermostUrl: <string>mattermostUrl,
      accessToken: <string>userAccessToken
   };
   const mmClient: MattermostClient = new MattermostClient(mattermostOpts);

   const docs = await getGoogleDocsClient(call);
   const params = {
      requestBody: {
         title: values.google_file_title
      }
   }
   const newDoc = await tryPromise<Schema$Document>(docs.documents.create(params), ExceptionType.TEXT_ERROR, 'Google failed: ');
   
   const drive = await getGoogleDriveClient(call);
   const paramExport: Params$Resource$Files$Get = {
      fileId: <string>newDoc.documentId,
      fields: 'webViewLink,id,owners,permissions,name,iconLink,thumbnailLink,createdTime'
   }
   
   const file = await tryPromise<Schema$File>(drive.files.get(paramExport), ExceptionType.TEXT_ERROR, 'Google failed: ');
   const owner = head(file.owners) as Schema$User;

   let channelId: string = call.context.channel?.id as string;
   if (!values.google_file_will_share) {
      const channel: Channel = await mmClient.createDirectChannel([<string>botUserID, <string>actingUserID]);
      channelId = channel.id;
   }

   const post: PostCreate = {
      message: <string>values.google_file_message,
      user_id: <string>actingUserID,
      channel_id: channelId,
      props: {
         attachments: [
            {
               author_name: `${owner.displayName}`,
               author_icon: `${owner?.photoLink}`,
               title: `${file.name}`,
               title_link: `${file.webViewLink}`,
               footer: `Google Drive for Mattermost | ${moment(file?.createdTime).format('MMM Do, YYYY')}`,
               footer_icon: `${file.iconLink}`,
               fields: [],
               actions: []
            }
         ]
      }
   };
   await mmClient.createPost(post);
   
}

export async function createGoogleSlidesForm(call: AppCallRequest): Promise<AppForm> {

   const values = call.values as CreateFileForm;
   const fields: AppField[] = [
      {
         type: AppFieldTypes.TEXT,
         name: CreateGoogleDocument.TITLE,
         modal_label: `Title (optional)`,
         is_required: false,
         value: values?.google_file_title,
      },
   ];

   if (!!values?.google_file_will_share) {
      fields.push(
         {
            type: AppFieldTypes.TEXT,
            subtype: AppFieldSubTypes.TEXTAREA,
            max_length: 32 * 1024,
            name: CreateGoogleDocument.MESSAGE,
            modal_label: 'Message (optional)',
            placeholder: `Add a message, if you'd like.`,
            is_required: false,
         }
      );
   }

   fields.push(
      {
         modal_label: ' ',
         type: AppFieldTypes.BOOL,
         name: CreateGoogleDocument.WILL_SHARE,
         is_required: false,
         refresh: true,
         hint: 'Share on this channel',
         value: values?.google_file_will_share,
      }
   );

   return {
      title: 'Create a Google Presentation',
      icon: GoogleDriveIcon,
      fields: fields,
      submit: {
         path: Routes.App.CallPathCreatePresentationSubmit,
         expand: {
            acting_user: AppExpandLevels.EXPAND_ALL,
            acting_user_access_token: AppExpandLevels.EXPAND_ALL,
            oauth2_app: AppExpandLevels.EXPAND_SUMMARY,
            oauth2_user: AppExpandLevels.EXPAND_SUMMARY,
            channel: AppExpandLevels.EXPAND_SUMMARY,
         }
      },
      source: {
         path: Routes.App.CallPathUpdateDocumentForm,
      }
   } as AppForm;
}

export async function createGoogleSlidesSubmit(call: AppCallRequest): Promise<any> {
   const mattermostUrl: string | undefined = call.context.mattermost_site_url;
   const userAccessToken: string | undefined = call.context.acting_user_access_token;
   const actingUserID: string | undefined = call.context.acting_user?.id;
   const botUserID: string | undefined = call.context.bot_user_id;
   const values = call.values as CreateFileForm;

   const mattermostOpts: MattermostOptions = {
      mattermostUrl: <string>mattermostUrl,
      accessToken: <string>userAccessToken
   };
   const mmClient: MattermostClient = new MattermostClient(mattermostOpts);

   const slides = await getGoogleSlidesClient(call);
   const params = {
      requestBody: {
         title: values.google_file_title
      }
   }
   const newSlide = await tryPromise<Schema$Presentation>(slides.presentations.create(params), ExceptionType.TEXT_ERROR, 'Google failed: ');

   const drive = await getGoogleDriveClient(call);
   const paramExport: Params$Resource$Files$Get = {
      fileId: <string>newSlide.presentationId,
      fields: 'webViewLink,id,owners,permissions,name,iconLink,thumbnailLink,createdTime'
   }

   const file = await tryPromise<Schema$File>(drive.files.get(paramExport), ExceptionType.TEXT_ERROR, 'Google failed: ');
   const owner = head(file.owners) as Schema$User;

   let channelId: string = call.context.channel?.id as string;
   if (!values.google_file_will_share) {
      const channel: Channel = await mmClient.createDirectChannel([<string>botUserID, <string>actingUserID]);
      channelId = channel.id;
   }

   const post: PostCreate = {
      message: <string>values.google_file_message,
      user_id: <string>actingUserID,
      channel_id: channelId,
      props: {
         attachments: [
            {
               author_name: `${owner.displayName}`,
               author_icon: `${owner?.photoLink}`,
               title: `${file.name}`,
               title_link: `${file.webViewLink}`,
               footer: `Google Drive for Mattermost | ${moment(file?.createdTime).format('MMM Do, YYYY')}`,
               footer_icon: `${file.iconLink}`,
               fields: [],
               actions: []
            }
         ]
      }
   };
   await mmClient.createPost(post);

}

export async function createGoogleSheetsForm(call: AppCallRequest): Promise<AppForm> {

   const values = call.values as CreateFileForm;
   const fields: AppField[] = [
      {
         type: AppFieldTypes.TEXT,
         name: CreateGoogleDocument.TITLE,
         modal_label: `Title (optional)`,
         is_required: false,
         value: values?.google_file_title,
      },
   ];

   if (!!values?.google_file_will_share) {
      fields.push(
         {
            type: AppFieldTypes.TEXT,
            subtype: AppFieldSubTypes.TEXTAREA,
            max_length: 32 * 1024,
            name: CreateGoogleDocument.MESSAGE,
            modal_label: 'Message (optional)',
            placeholder: `Add a message, if you'd like.`,
            is_required: false,
         }
      );
   }

   fields.push(
      {
         modal_label: ' ',
         type: AppFieldTypes.BOOL,
         name: CreateGoogleDocument.WILL_SHARE,
         is_required: false,
         refresh: true,
         hint: 'Share on this channel',
         value: values?.google_file_will_share,
      }
   );

   return {
      title: 'Create a Google Spreadsheet',
      icon: GoogleDriveIcon,
      fields: fields,
      submit: {
         path: Routes.App.CallPathCreateSpreadsheetSubmit,
         expand: {
            acting_user: AppExpandLevels.EXPAND_ALL,
            acting_user_access_token: AppExpandLevels.EXPAND_ALL,
            oauth2_app: AppExpandLevels.EXPAND_SUMMARY,
            oauth2_user: AppExpandLevels.EXPAND_SUMMARY,
            channel: AppExpandLevels.EXPAND_SUMMARY,
         }
      },
      source: {
         path: Routes.App.CallPathUpdateDocumentForm,
      }
   } as AppForm;
}

export async function createGoogleSheetsSubmit(call: AppCallRequest): Promise<any> {
   const mattermostUrl: string | undefined = call.context.mattermost_site_url;
   const userAccessToken: string | undefined = call.context.acting_user_access_token;
   const actingUserID: string | undefined = call.context.acting_user?.id;
   const botUserID: string | undefined = call.context.bot_user_id;
   const values = call.values as CreateFileForm;

   const mattermostOpts: MattermostOptions = {
      mattermostUrl: <string>mattermostUrl,
      accessToken: <string>userAccessToken
   };
   const mmClient: MattermostClient = new MattermostClient(mattermostOpts);

   const sheets = await getGoogleSheetsClient(call);
   const params = {
      requestBody: {
         properties: {
            title: values.google_file_title
         }
      }
   }
   const newSheets = await tryPromise<Schema$Spreadsheet>(sheets.spreadsheets.create(params), ExceptionType.TEXT_ERROR, 'Google failed: ');

   const drive = await getGoogleDriveClient(call);
   const paramExport: Params$Resource$Files$Get = {
      fileId: <string>newSheets.spreadsheetId,
      fields: 'webViewLink,id,owners,permissions,name,iconLink,thumbnailLink,createdTime'
   }

   const file = await tryPromise<Schema$File>(drive.files.get(paramExport), ExceptionType.TEXT_ERROR, 'Google failed: ');
   const owner = head(file.owners) as Schema$User;

   let channelId: string = call.context.channel?.id as string;
   if (!values.google_file_will_share) {
      const channel: Channel = await mmClient.createDirectChannel([<string>botUserID, <string>actingUserID]);
      channelId = channel.id;
   }

   const post: PostCreate = {
      message: <string>values.google_file_message,
      user_id: <string>actingUserID,
      channel_id: channelId,
      props: {
         attachments: [
            {
               author_name: `${owner.displayName}`,
               author_icon: `${owner?.photoLink}`,
               title: `${file.name}`,
               title_link: `${file.webViewLink}`,
               footer: `Google Drive for Mattermost | ${moment(file?.createdTime).format('MMM Do, YYYY')}`,
               footer_icon: `${file.iconLink}`,
               fields: [],
               actions: []
            }
         ]
      }
   };
   await mmClient.createPost(post);

}