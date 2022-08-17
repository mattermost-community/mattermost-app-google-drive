import { KVStoreClient } from "../clients";
import { AppBindingLocations, Commands, CommandTrigger, GoogleDriveIcon } from "../constant";
import { AppBinding, AppCallRequest, AppsState, KVStoreOptions } from "../types";
import { getHelpBinding } from "./bindings";

const newHeaderButtonBindings = (bindings: AppBinding[], commands: string[]): AppsState => {
   return {
      location: AppBindingLocations.CHANNEL_HEADER_ICON,
      bindings: bindings
   };
};

export const getHeaderButtonBindings = async (call: AppCallRequest): Promise<AppsState> => {
   const mattermostUrl: string | undefined = call.context.mattermost_site_url;
   const botAccessToken: string | undefined = call.context.bot_access_token;

   const options: KVStoreOptions = {
      mattermostUrl: <string>mattermostUrl,
      accessToken: <string>botAccessToken,
   };
   const kvClient = new KVStoreClient(options);

   const bindings: AppBinding[] = [];
   const commands: string[] = [
      Commands.HELP
   ];

   bindings.push(getHelpBinding());

   return newHeaderButtonBindings(bindings, commands);
};
