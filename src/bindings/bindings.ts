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