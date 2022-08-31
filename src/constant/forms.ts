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
   USER_OR_CHANNEL: 'google_file_user_channel',
   SELECT_SHARE: 'google_file_share_selected',
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
