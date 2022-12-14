import {
    Request,
    Response,
} from 'express';

import {
    uploadFileConfirmationCall,
    uploadFileConfirmationSubmit,
} from '../forms/upload-google';
import {
    AppCallResponse,
} from '../types';
import {
    CallResponseHandler,
    newFormCallResponse,
    newOKCallResponse,
} from '../utils/call-responses';
import {
    showMessageToMattermost,
} from '../utils/utils';

export const uploadFileToDriveCall: CallResponseHandler = async (req: Request, res: Response) => {
    let callResponse: AppCallResponse;

    try {
        const form = await uploadFileConfirmationCall(req.body);
        callResponse = newFormCallResponse(form);
    } catch (error: any) {
        callResponse = showMessageToMattermost(error);
    }
    res.json(callResponse);
};

export const uploadFileToDriveSubmit: CallResponseHandler = async (req: Request, res: Response) => {
    let callResponse: AppCallResponse;

    try {
        await uploadFileConfirmationSubmit(req.body);
        callResponse = newOKCallResponse();
    } catch (error: any) {
        callResponse = showMessageToMattermost(error);
    }
    res.json(callResponse);
};
