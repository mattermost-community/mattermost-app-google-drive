
import { Request, Response } from 'express';
import { oAuth2Complete, oAuth2Connect } from '../forms/oauth-google';
import { AppCallRequest, AppCallResponse, Oauth2App } from '../types';
 import { CallResponseHandler, newOKCallResponse, newOKCallResponseWithData, newOKCallResponseWithMarkdown } from "../utils/call-responses";
import { hyperlink } from '../utils/markdown';
import { isConnected, showMessageToMattermost } from '../utils/utils';

export const getConnectGoogleURL: CallResponseHandler = async (req: Request, res: Response) => {
   const call: AppCallRequest = req.body;
   const connectUrl: string | undefined = call.context.oauth2?.connect_url;
   const oauth2: Oauth2App | undefined = call.context.oauth2 as Oauth2App;
   const message: string = isConnected(oauth2?.user)
      ? `You are already logged into Google with user ${oauth2}`
      : `Follow this ${hyperlink('link', <string>connectUrl)} to connect Mattermost to your Google Account.`;
   const callResponse: AppCallResponse = newOKCallResponseWithMarkdown(message);
   res.json(callResponse);
};

export const fOauth2Connect: CallResponseHandler = async (req: Request, res: Response) => {
   let callResponse: AppCallResponse;

   try {
      const url: string = await oAuth2Connect(req.body);
      callResponse = newOKCallResponseWithData(url);
   } catch (error: any) {
      callResponse = showMessageToMattermost(error);
   }
   res.json(callResponse);
}

export const fOauth2Complete: CallResponseHandler = async (req: Request, res: Response) => {
   let callResponse: AppCallResponse;

   try {
      await oAuth2Complete(req.body);
      callResponse = newOKCallResponse();
   } catch (error: any) {
      callResponse = showMessageToMattermost(error);
   }
   res.json(callResponse);
}