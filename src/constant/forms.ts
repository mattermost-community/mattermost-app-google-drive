import { AppSelectOption } from "../types"

export const ConfigureClientForm = Object.freeze({
   CLIENT_ID: 'google_drive_client_id',
   CLIENT_SECRET: 'google_drive_client_secret',
   MODE: 'google_drive_mode',
   SERVICE_ACCOUNT: 'google_drive_service_account',
   API_KEY: 'google_drive_api_key',
})

export const CreateGoogleDocument = Object.freeze({
   TITLE: 'google_file_title',
   MESSAGE: 'google_file_message',
   WILL_SHARE: 'google_file_will_share',
   FILE_ACCESS: 'google_file_access',
})

export const optConfigure = {
   fAccountJSON: 'account_json',
   fAPIKey: 'api_key',
   fNone: ''
}

export const modeConfiguration: AppSelectOption[] = [
   {
      label: 'Do not use a Service Account',
      value: optConfigure.fNone,
   },
   {
      label: 'Use a Google Service Account',
      value: optConfigure.fAccountJSON,
   },
   {
      label: 'Use a Google API Key',
      value: optConfigure.fAPIKey,
   }
] 

export const optFileShare = {
   notShare: 'not_share',
   sAView: 'anyone_view',
   sAComment: 'anyone_comment',
   sAEdit: 'anyone_edit',
   sCView: 'channel_view',
   sCComment: 'channel_comment',
   scEdit: 'channel_edit',
}
export const doNotShare: AppSelectOption = 
{
   label: 'Keep file private',
   value: optFileShare.notShare
}

export const fileShareAnyone: AppSelectOption[] = [
   {
      label: 'Anyone with the link can view',
      value: optFileShare.sAView
   },
   {
      label: 'Anyone with the link can comment',
      value: optFileShare.sAComment
   },
   {
      label: 'Anyone with the link can edit',
      value: optFileShare.sAEdit
   }
] 

export const fileShareChannel: AppSelectOption[] = [
   {
      label: 'Member of the channel can view',
      value: optFileShare.sCView
   },
   {
      label: 'Member of the channel can comment',
      value: optFileShare.sCComment
   },
   {
      label: 'Member of the channel can edit',
      value: optFileShare.scEdit
   }
] 

export const shareFileOnChannel: AppSelectOption[] = [
   doNotShare,
   {
      label: 'NUUUUULL',
      value: null
   },
   ...fileShareChannel,
   ...fileShareAnyone
]

export const notShareFileOnChannel: AppSelectOption[] = [
   doNotShare,
   ...fileShareAnyone
]

export const ReplyCommentForm = Object.freeze({
   RESPONSE: 'google_response_comment',
})