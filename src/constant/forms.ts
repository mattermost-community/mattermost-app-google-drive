import { AppSelectOption } from "../types"

export const ConfigureClientForm = Object.freeze({
   CLIENT_ID: 'google_drive_client_id',
   CLIENT_SECRET: 'google_drive_client_secret',
   MODE: 'google_drive_mode',
   SERVICE_ACCOUNT: 'google_drive_service_account',
   API_KEY: 'google_drive_api_key',
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
