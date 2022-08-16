import { KVStoreClient } from "../clients";
import { AppBindingLocations, Commands, CommandTrigger, GoogleDriveIcon } from "../constant";
import { AppBinding, AppCallRequest, AppsState, KVStoreOptions } from "../types";
import { 
   getConfigureBinding, 
   getConnectBinding, 
   getHelpBinding
 } from "./bindings";

const newCommandBindings = (bindings: AppBinding[], commands: string[]): AppsState => {
   return {
      location: AppBindingLocations.COMMAND,
      bindings: [
         {
            icon: GoogleDriveIcon,
            label: CommandTrigger,
            hint: `[${commands.join(' | ')}]`,
            description: 'Manage Google Drive',
            bindings,
         },
      ],
   };
};

export const getCommandBindings = async (call: AppCallRequest): Promise<AppsState> => {
   const mattermostUrl: string | undefined = call.context.mattermost_site_url;
   const botAccessToken: string | undefined = call.context.bot_access_token;

   const options: KVStoreOptions = {
      mattermostUrl: <string>mattermostUrl,
      accessToken: <string>botAccessToken,
   };
   const kvClient = new KVStoreClient(options);

   const bindings: AppBinding[] = [];
   const commands: string[] = [
      Commands.HELP,
      Commands.CONFIGURE,
      Commands.CONNECT,
   ];

   bindings.push(getHelpBinding());
   bindings.push(getConfigureBinding());
   bindings.push(getConnectBinding());
   
   return newCommandBindings(bindings, commands);
};
