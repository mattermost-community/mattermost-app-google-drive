import { KVStoreClient } from "../clients";
import { 
   AppBindingLocations, 
   Commands, 
   CommandTrigger, 
   GoogleDriveIcon 
} from "../constant";
import { 
   AppActingUser, 
   AppBinding, 
   AppCallRequest, 
   AppsState, 
   KVStoreOptions 
} from "../types";
import { existsKvGoogleClientConfig, isUserSystemAdmin } from "../utils/utils";
import { 
   getConfigureBinding, 
   getConnectBinding, 
   getDisconnectBinding, 
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
   const actingUser: AppActingUser | undefined = call.context.acting_user;

   const options: KVStoreOptions = {
      mattermostUrl: <string>mattermostUrl,
      accessToken: <string>botAccessToken,
   };
   const kvClient = new KVStoreClient(options);

   const bindings: AppBinding[] = [ getHelpBinding() ];
   const commands: string[] = [ Commands.HELP ];

   if (isUserSystemAdmin(<AppActingUser>actingUser)) {
      bindings.push(getConfigureBinding());
      commands.push(Commands.CONFIGURE)
   }

   if (await existsKvGoogleClientConfig(kvClient)) { 
      commands.push(Commands.CONNECT);
      bindings.push(getConnectBinding());
      commands.push(Commands.DISCONNECT);
      bindings.push(getDisconnectBinding());
   }
   
   
   return newCommandBindings(bindings, commands);
};
