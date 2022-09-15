import { 
   AppExpandLevels,
   GoogleDriveIcon, 
   Commands, 
   Routes,
   PostMenu,
} from "../constant";
import { AppBinding } from "../types";
import manifest from '../manifest.json';

export const getHelpBinding = (): AppBinding => {
   return {
      app_id: manifest.app_id,
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

export const getConfigureBinding = (): AppBinding => {
   return {
      app_id: manifest.app_id,
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

export const getConnectBinding = (): AppBinding => {
   return {
      app_id: manifest.app_id,
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

export const getDisconnectBinding = (): AppBinding => {
   return {
      app_id: manifest.app_id,
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

export const getNotificationBinding = (): AppBinding => {
   const subCommands: string[] = [
      Commands.START,
      Commands.STOP
   ];

   const bindings: AppBinding[] = [];
   bindings.push(getNotificationStartBinding());
   bindings.push(getNotificationStopBinding());

   return {
      app_id: manifest.app_id,
      icon: GoogleDriveIcon,
      label: Commands.NOTIFICATION,
      description: 'Stop or start getting notifications about comments',
      hint: `[${subCommands.join(' | ')}]`,
      bindings
   }
};

export const getNotificationStartBinding = (): AppBinding => {
   return {
      app_id: manifest.app_id,
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

export const getNotificationStopBinding = (): AppBinding => {
   return {
      app_id: manifest.app_id,
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

export const getCreateGoogleFilesBinding = (): AppBinding => {
   const commands: string[] = [
      Commands.DOCUMENT,
      Commands.PRESENTATION,
      Commands.SPREADSHEET,
   ];

   const bindings: AppBinding[] = [];
   bindings.push(getCreateDocumentBinding());
   bindings.push(getCreatePresentationBinding());
   bindings.push(getCreateSpreadsheetBinding());

   return {
      app_id: manifest.app_id,
      icon: GoogleDriveIcon,
      label: Commands.CREATE,
      description: 'Create new files on your Google Drive',
      hint: `[${commands.join(' | ')}]`,
      bindings
   }
}

export const getCreateDocumentBinding = (): AppBinding => {
   return {
      app_id: manifest.app_id,
      label: Commands.DOCUMENT,
      description: 'Create a document with Google Drive',
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

export const getCreatePresentationBinding = (): AppBinding => {
   return {
      app_id: manifest.app_id,
      label: Commands.PRESENTATION,
      description: 'Create a presentation with Google Drive',
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

export const getCreateSpreadsheetBinding = (): AppBinding => {
   return {
      app_id: manifest.app_id,
      label: Commands.SPREADSHEET,
      description: 'Create a spreadsheet with Google Drive',
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

export const saveFileOnDriveBinding = (): AppBinding => {
   return {
      app_id: manifest.app_id,
      label: PostMenu.SAVE_FILE,
      icon: GoogleDriveIcon,
      submit: {
         path: Routes.App.CallPathSaveFileCall,
         expand: {
            acting_user_access_token: AppExpandLevels.EXPAND_ALL,
            post: AppExpandLevels.EXPAND_SUMMARY,
         }
      },
   };
};