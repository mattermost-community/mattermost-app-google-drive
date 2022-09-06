import { Request, Response } from 'express';
import { 
   manageReplyCommentSubmit, 
   manageWebhookCall, 
   openFormReplyComment 
} from '../forms/manage-webhook';
import { AppCallResponse } from '../types';
import { CallResponseHandler, newFormCallResponse, newOKCallResponse } from "../utils/call-responses";
import { showMessageToMattermost } from '../utils/utils';

export const filterWebhookNotification: CallResponseHandler = async (req: Request, res: Response) => {
   let callResponse: AppCallResponse;

   try {
      await manageWebhookCall(req.body);
      callResponse = newOKCallResponse();
   } catch (error: any) {
      callResponse = showMessageToMattermost(error);
   }
   res.json(callResponse);
}

export const replyToCommentForm: CallResponseHandler = async (req: Request, res: Response) => {
   let callResponse: AppCallResponse;

   try {
      const form = await openFormReplyComment(req.body);
      callResponse = newFormCallResponse(form);
   } catch (error: any) {
      callResponse = showMessageToMattermost(error);
   }
   res.json(callResponse);
}

export const replyToCommentSubmit: CallResponseHandler = async (req: Request, res: Response) => {
   let callResponse: AppCallResponse;

   try {
      await manageReplyCommentSubmit(req.body);
      callResponse = newOKCallResponse();
   } catch (error: any) {
      callResponse = showMessageToMattermost(error);
   }
   res.json(callResponse);
}