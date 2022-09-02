import { CreateGoogleDocument } from "../constant";

export interface CreateFileForm {
   [CreateGoogleDocument.TITLE]: string | null;
   [CreateGoogleDocument.MESSAGE]: string | null;
   [CreateGoogleDocument.WILL_SHARE]: boolean;
}