import { ConfigureClientForm } from "../constant";
import { AppSelectOption } from "./apps";

export interface KVStoreOptions {
   mattermostUrl: string;
   accessToken: string;
}

export interface KVStoreProps {
   [ConfigureClientForm.CLIENT_ID]: string;
   [ConfigureClientForm.CLIENT_SECRET]: string;
   [ConfigureClientForm.MODE]?: string | AppSelectOption;
   [ConfigureClientForm.SERVICE_ACCOUNT]?: string;
   [ConfigureClientForm.API_KEY]?: string;
}