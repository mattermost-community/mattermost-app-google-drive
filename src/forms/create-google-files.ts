import { 
   AppFieldSubTypes, 
   AppFieldTypes, 
   ConfigureClientForm, 
   CreateGoogleDocument, 
   GoogleDriveIcon, 
   Routes 
} from "../constant";
import { 
   AppCallRequest, 
   AppField, 
   AppForm, 
   AppSelectOption
} from "../types";
import { 
   CreateFileForm 
} from "../types/forms";


export async function createGoogleDocForm(call: AppCallRequest): Promise<AppForm> {

   const values = call.values as CreateFileForm;
   const fields: AppField[] = [
      {
         type: AppFieldTypes.TEXT,
         name: CreateGoogleDocument.TITLE,
         modal_label: `Title (optional)`,
         is_required: false,
         value: values?.google_file_title,
      },
   ];

   if (!!values?.google_file_will_share) {
      fields.push(
         {
            type: AppFieldTypes.TEXT,
            subtype: AppFieldSubTypes.TEXTAREA,
            max_length: 32 * 1024,
            name: CreateGoogleDocument.MESSAGE,
            modal_label: 'Message (optional)',
            placeholder: `Add a message, if you'd like.`,
            is_required: false,
         }
      );
   }

   fields.push(
      {
         modal_label: ' ',
         type: AppFieldTypes.BOOL,
         name: CreateGoogleDocument.WILL_SHARE,
         is_required: false,
         refresh: true,
         hint: 'Share this document',
         value: values?.google_file_will_share,
      }
   );

   return {
      title: 'Create a Google Document',
      icon: GoogleDriveIcon,
      fields: fields,
      submit: {
         path: Routes.App.CallPathCreateDocumentSubmit,
         expand: {}
      },
      source: {
         path: Routes.App.CallPathUpdateDocumentForm,
      }
   } as AppForm;
}

export async function createGoogleDocSubmit(call: AppCallRequest): Promise<any> {

}

export async function createGoogleSlidesForm(call: AppCallRequest): Promise<AppForm> {

   const values = call.values as CreateFileForm;
   const fields: AppField[] = [
      {
         type: AppFieldTypes.TEXT,
         name: CreateGoogleDocument.TITLE,
         modal_label: `Title (optional)`,
         is_required: false,
         value: values?.google_file_title,
      },
   ];

   if (!!values?.google_file_will_share) {
      fields.push(
         {
            type: AppFieldTypes.TEXT,
            subtype: AppFieldSubTypes.TEXTAREA,
            max_length: 32 * 1024,
            name: CreateGoogleDocument.MESSAGE,
            modal_label: 'Message (optional)',
            placeholder: `Add a message, if you'd like.`,
            is_required: false,
         }
      );
   }

   fields.push(
      {
         modal_label: ' ',
         type: AppFieldTypes.BOOL,
         name: CreateGoogleDocument.WILL_SHARE,
         is_required: false,
         refresh: true,
         hint: 'Share this document',
         value: values?.google_file_will_share,
      }
   );

   return {
      title: 'Create a Google Presentation',
      icon: GoogleDriveIcon,
      fields: fields,
      submit: {
         path: Routes.App.CallPathCreateDocumentSubmit,
         expand: {}
      },
      source: {
         path: Routes.App.CallPathUpdateDocumentForm,
      }
   } as AppForm;
}

export async function createGoogleSlidesSubmit(call: AppCallRequest): Promise<any> {

}

export async function createGoogleSheetsForm(call: AppCallRequest): Promise<AppForm> {

   const values = call.values as CreateFileForm;
   const fields: AppField[] = [
      {
         type: AppFieldTypes.TEXT,
         name: CreateGoogleDocument.TITLE,
         modal_label: `Title (optional)`,
         is_required: false,
         value: values?.google_file_title,
      },
   ];

   if (!!values?.google_file_will_share) {
      fields.push(
         {
            type: AppFieldTypes.TEXT,
            subtype: AppFieldSubTypes.TEXTAREA,
            max_length: 32 * 1024,
            name: CreateGoogleDocument.MESSAGE,
            modal_label: 'Message (optional)',
            placeholder: `Add a message, if you'd like.`,
            is_required: false,
         }
      );
   }

   fields.push(
      {
         modal_label: ' ',
         type: AppFieldTypes.BOOL,
         name: CreateGoogleDocument.WILL_SHARE,
         is_required: false,
         refresh: true,
         hint: 'Share this document',
         value: values?.google_file_will_share,
      }
   );

   return {
      title: 'Create a Google Spreadsheet',
      icon: GoogleDriveIcon,
      fields: fields,
      submit: {
         path: Routes.App.CallPathCreateDocumentSubmit,
         expand: {}
      },
      source: {
         path: Routes.App.CallPathUpdateDocumentForm,
      }
   } as AppForm;
}

export async function createGoogleSheetsSubmit(call: AppCallRequest): Promise<any> {

}