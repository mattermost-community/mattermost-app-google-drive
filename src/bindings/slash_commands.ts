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
   AppContext, 
   AppsState, 
   Oauth2App
} from "../types";
import { 
   existsOauth2AppConfig, 
   isConnected, 
   isUserSystemAdmin 
} from "../utils/utils";
import { 
   getConfigureBinding, 
   getConnectBinding, 
   getCreateGoogleFilesBinding, 
   getDisconnectBinding, 
   getHelpBinding,
   getNotificationBinding
 } from "./bindings";
import manifest from '../manifest.json'; 
import { configureI18n } from "../utils/translations";

const [_, i18nObj] = configureI18n(false);

const newCommandBindings = (context: AppContext, bindings: AppBinding[], commands: string[]): AppsState => {
   const m = manifest;
   const locale = context.locale;
   i18nObj.setLocale(locale);

   return {
      app_id: m.app_id,
      label: CommandTrigger,
      location: AppBindingLocations.COMMAND,
      bindings: [
         {
            app_id: m.app_id,
            icon: GoogleDriveIcon,
            label: CommandTrigger,
            hint: `[${commands.join(' | ')}]`,
            description: i18nObj.__('bindings-descriptions.bindings'),
            bindings,
         },
      ],
   };
};

export const getCommandBindings = async (call: AppCallRequest): Promise<AppsState> => {
   const actingUser: AppActingUser | undefined = call.context.acting_user;
   const oauth2App: Oauth2App = call.context.oauth2 as Oauth2App;
   const context = call.context as AppContext;

   const bindings: AppBinding[] = [getHelpBinding(context) ];
   const commands: string[] = [ Commands.HELP ];

   if (isUserSystemAdmin(<AppActingUser>actingUser)) {
      bindings.push(getConfigureBinding(context));
      commands.push(Commands.CONFIGURE)
   }

   if (await existsOauth2AppConfig(oauth2App)) { 
      if (isConnected(oauth2App)) {
         commands.push(Commands.NOTIFICATION);
         bindings.push(getNotificationBinding(context));
         commands.push(Commands.CREATE);
         bindings.push(getCreateGoogleFilesBinding(context));
      }

      commands.push(Commands.CONNECT);
      bindings.push(getConnectBinding(context));
      commands.push(Commands.DISCONNECT);
      bindings.push(getDisconnectBinding(context));
   }
   
   
   return newCommandBindings(context, bindings, commands);
};
