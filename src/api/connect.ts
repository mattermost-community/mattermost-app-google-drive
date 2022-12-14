import { Request, Response } from 'express';

import {
    getConnectLink,
    oAuth2Complete,
    oAuth2Connect,
    oAuth2Disconnect,
} from '../forms/oauth-google';
import { AppCallResponse } from '../types';
import {
    CallResponseHandler,
    newOKCallResponse,
    newOKCallResponseWithData,
    newOKCallResponseWithMarkdown,
} from '../utils/call-responses';
import { showMessageToMattermost } from '../utils/utils';

export const getConnectGoogleURL: CallResponseHandler = async (req: Request, res: Response) => {
    let callResponse: AppCallResponse;

    try {
        const url: string = await getConnectLink(req.body);
        callResponse = newOKCallResponseWithMarkdown(url);
    } catch (error: any) {
        callResponse = showMessageToMattermost(error);
    }
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
};

export const fOauth2Complete: CallResponseHandler = async (req: Request, res: Response) => {
    let callResponse: AppCallResponse;

    try {
        await oAuth2Complete(req.body);
        callResponse = newOKCallResponse();
    } catch (error: any) {
        callResponse = showMessageToMattermost(error);
    }
    res.json(callResponse);
};

export const doDisconnectGoogle: CallResponseHandler = async (req: Request, res: Response) => {
    let callResponse: AppCallResponse;

    try {
        await oAuth2Disconnect(req.body);
        callResponse = newOKCallResponse();
    } catch (error: any) {
        callResponse = showMessageToMattermost(error);
    }
    res.json(callResponse);
};
