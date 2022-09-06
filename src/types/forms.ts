import { CreateGoogleDocument, ReplyCommentForm } from "../constant";

export interface CreateFileForm {
   [CreateGoogleDocument.TITLE]: string | null;
   [CreateGoogleDocument.MESSAGE]: string | null;
   [CreateGoogleDocument.WILL_SHARE]: boolean;
}

export interface ReplyCommentFormType {
   [ReplyCommentForm.RESPONSE]: string;
}

export type CommentState = {
   comment: {
      id: string
   },
   file: {
      id: string
   }
}