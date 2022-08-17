import { ConfigureClientForm } from "../constant";

export interface KVStoreOptions {
   mattermostUrl: string;
   accessToken: string;
}

export interface KVStoreProps {
   [ConfigureClientForm.CLIENT_ID]: string;
   [ConfigureClientForm.CLIENT_SECRET]: string;
}