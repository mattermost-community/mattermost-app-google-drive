import { 
   AppExpandLevels,
   GoogleDriveIcon, 
   Commands, 
   Routes,
} from "../constant";
import { PostMenu } from "../constant/post-menu";
import { AppBinding } from "../types";

export const getHelpBinding = (): any => {
   return {
      label: Commands.HELP,
      icon: GoogleDriveIcon,
      description: 'Show Google Drive Help',
      submit: {
         path: Routes.App.CallPathHelp,
         expand: {
            acting_user: AppExpandLevels.EXPAND_ALL,
            oauth2_app: AppExpandLevels.EXPAND_SUMMARY,
            oauth2_user: AppExpandLevels.EXPAND_SUMMARY
         }
      }
   };
};

export const getConfigureBinding = (): any => {
   return {
      icon: GoogleDriveIcon,
      label: Commands.CONFIGURE,
      description: 'Setup Google Client',
      submit: {
         path: Routes.App.CallPathConfigForm,
         expand: {
            oauth2_app: AppExpandLevels.EXPAND_SUMMARY
         }
      }
   }
};

export const getConnectBinding = (): any => {
   return {
      icon: GoogleDriveIcon,
      label: Commands.CONNECT,
      description: 'Connect your Google account',
      submit: {
         path: Routes.App.CallPathConnectSubmit,
         expand: {
            oauth2_app: AppExpandLevels.EXPAND_SUMMARY,
            oauth2_user: AppExpandLevels.EXPAND_SUMMARY
         }
      }
   }
};

export const getDisconnectBinding = (): any => {
   return {
      icon: GoogleDriveIcon,
      label: Commands.DISCONNECT,
      description: 'Disconnect from your Google account',
      submit: {
         path: Routes.App.CallPathDisconnectSubmit,
         expand: {
            acting_user_access_token: AppExpandLevels.EXPAND_ALL,
            oauth2_user: AppExpandLevels.EXPAND_SUMMARY,
            oauth2_app: AppExpandLevels.EXPAND_SUMMARY
         }
      }
   }
};

export const getNotificationBinding = (): any => {
   const subCommands: string[] = [
      Commands.START,
      Commands.STOP
   ];

   const bindings: AppBinding[] = [];
   bindings.push(getNotificationStartBinding());
   bindings.push(getNotificationStopBinding());

   return {
      icon: GoogleDriveIcon,
      label: Commands.NOTIFICATION,
      description: 'Stop or start getting notifications about comments',
      hint: `[${subCommands.join(' | ')}]`,
      bindings
   }
};

export const getNotificationStartBinding = (): any => {
   return {
      icon: GoogleDriveIcon,
      label: Commands.START,
      description: 'Start getting notified about Google Drive comments',
      submit: {
         path: Routes.App.CallPathStartNotifications,
         expand: {
            app: AppExpandLevels.EXPAND_SUMMARY,
            oauth2_app: AppExpandLevels.EXPAND_SUMMARY,
            oauth2_user: AppExpandLevels.EXPAND_SUMMARY
         }
      }
   }
};

export const getNotificationStopBinding = (): any => {
   return {
      icon: GoogleDriveIcon,
      label: Commands.STOP,
      description: 'Stop getting notified about Google Drive comments',
      submit: {
         path: Routes.App.CallPathStopNotifications,
         expand: {
            app: AppExpandLevels.EXPAND_SUMMARY,
            oauth2_app: AppExpandLevels.EXPAND_SUMMARY,
            oauth2_user: AppExpandLevels.EXPAND_SUMMARY
         }
      }
   }
};


export const getCreateDocumentBinding = (): any => {
   return {
      label: PostMenu.DOCUMENT,
      description: 'With Google Drive',
      icon: GoogleDriveIcon,
      submit: {
         path: Routes.App.CallPathCreateDocument,
         expand: {
            app: AppExpandLevels.EXPAND_SUMMARY,
            oauth2_app: AppExpandLevels.EXPAND_SUMMARY,
            oauth2_user: AppExpandLevels.EXPAND_SUMMARY
         }
      },
   };
};

export const getCreatePresentationBinding = (): any => {
   return {
      label: PostMenu.PRESENTATION,
      description: 'With Google Drive',
      icon: GoogleDriveIcon,
      submit: {
         path: Routes.App.CallPathCreatePresentation,
         expand: {
            app: AppExpandLevels.EXPAND_SUMMARY,
            oauth2_app: AppExpandLevels.EXPAND_SUMMARY,
            oauth2_user: AppExpandLevels.EXPAND_SUMMARY
         }
      },
   };
};

export const getCreateSpreadsheetBinding = (): any => {
   return {
      label: PostMenu.SPREADSHEET,
      description: 'With Google Drive',
      icon: GoogleDriveIcon,
      submit: {
         path: Routes.App.CallPathCreateSpreadsheet,
         expand: {
            app: AppExpandLevels.EXPAND_SUMMARY,
            oauth2_app: AppExpandLevels.EXPAND_SUMMARY,
            oauth2_user: AppExpandLevels.EXPAND_SUMMARY
         }
      },
   };
};