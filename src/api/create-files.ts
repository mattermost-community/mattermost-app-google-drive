import { 
   Request, 
   Response 
} from 'express';
import { 
   createGoogleDocForm, 
   createGoogleSheetsForm, 
   createGoogleSlidesForm 
} from '../forms/create-google-files';
import { 
   AppCallResponse 
} from '../types';
import { 
   CallResponseHandler, 
   newOKCallResponseWithMarkdown 
} from "../utils/call-responses";
import {
   showMessageToMattermost 
} from '../utils/utils';


export const createGoogleDoc: CallResponseHandler = async (req: Request, res: Response) => {
   let callResponse: AppCallResponse;

   try {
      const message = await createGoogleDocForm(req.body);
      callResponse = newOKCallResponseWithMarkdown(message);
   } catch (error: any) {
      callResponse = showMessageToMattermost(error);
   }
   res.json(callResponse);
}

export const createGoogleSlides: CallResponseHandler = async (req: Request, res: Response) => {
   let callResponse: AppCallResponse;

   try {
      const message = await createGoogleSlidesForm(req.body);
      callResponse = newOKCallResponseWithMarkdown(message);
   } catch (error: any) {
      callResponse = showMessageToMattermost(error);
   }
   res.json(callResponse);
}

export const createGoogleSheets: CallResponseHandler = async (req: Request, res: Response) => {
   let callResponse: AppCallResponse;

   try {
      const message = await createGoogleSheetsForm(req.body);
      callResponse = newOKCallResponseWithMarkdown(message);
   } catch (error: any) {
      callResponse = showMessageToMattermost(error);
   }
   res.json(callResponse);
}