import { Request, Response } from 'express';
import {
    CallResponseHandler,
    newErrorCallResponseWithMessage,
    newFormCallResponse,
} from '../utils/call-responses';
import { AppCallResponse } from '../types';
import { googleClientConfigForm } from '../forms/configure-google-client';

export const configureGoogleClient: CallResponseHandler = async (req: Request, res: Response) => {
    let callResponse: AppCallResponse;

    try {
        const form = await googleClientConfigForm(req.body);
        callResponse = newFormCallResponse(form);
    } catch (error: any) {
        callResponse = newErrorCallResponseWithMessage('Unable to open configuration form: ' + error.message);
    }
    res.json(callResponse);
};


