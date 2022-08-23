import { 
   AppExpandLevels,
   GoogleDriveIcon, 
   Commands, 
   Routes,
} from "../constant";

export const getHelpBinding = (): any => {
   return {
      label: Commands.HELP,
      icon: GoogleDriveIcon,
      description: 'Show Google Drive Help',
      form: {
         icon: GoogleDriveIcon,
         submit: {
            path: Routes.App.CallPathHelp,
            expand: {
               acting_user: AppExpandLevels.EXPAND_ALL
            }
         }
      }
   };
};

export const getConfigureBinding = (): any => {
   return {
      icon: GoogleDriveIcon,
      label: Commands.CONFIGURE,
      description: 'Setup Google Client',
      form: {
         title: "Setup Google Client",
         icon: GoogleDriveIcon,
         submit: {
            path: Routes.App.CallPathConfigForm,
            expand: {
               oauth2_app: AppExpandLevels.EXPAND_SUMMARY
            }
         }
      }
   }
};

export const getConnectBinding = (): any => {
   return {
      icon: GoogleDriveIcon,
      label: Commands.CONNECT,
      description: 'Connect your Google account',
      form: {
         title: "Google account login",
         icon: GoogleDriveIcon,
         submit: {
            path: Routes.App.CallPathConnectSubmit,
            expand: {
               oauth2_app: AppExpandLevels.EXPAND_SUMMARY,
               oauth2_user: AppExpandLevels.EXPAND_SUMMARY
            }
         }
      }
   }
};

export const getDisconnectBinding = (): any => {
   return {
      icon: GoogleDriveIcon,
      label: Commands.DISCONNECT,
      description: 'Disconnect from your Google account',
      form: {
         title: "Account disconnect",
         icon: GoogleDriveIcon,
         submit: {
            path: Routes.App.CallPathDisconnectSubmit,
            expand: {
               acting_user_access_token: AppExpandLevels.EXPAND_ALL,
               oauth2_user: AppExpandLevels.EXPAND_SUMMARY,
               oauth2_app: AppExpandLevels.EXPAND_SUMMARY
            }
         }
      }
   }
};