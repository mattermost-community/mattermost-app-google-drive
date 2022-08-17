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
               admin_access_token: AppExpandLevels.EXPAND_SUMMARY,
               acting_user: AppExpandLevels.EXPAND_SUMMARY,
               acting_user_access_token: AppExpandLevels.EXPAND_SUMMARY,
               oauth2_app: AppExpandLevels.EXPAND_SUMMARY,
               oauth2_user: AppExpandLevels.EXPAND_SUMMARY,
               app: AppExpandLevels.EXPAND_SUMMARY,
            }
         }
      }
   }
};