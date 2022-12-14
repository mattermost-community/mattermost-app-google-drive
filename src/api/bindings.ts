import { Request, Response } from 'express';

import { getAppBindings } from '../bindings';
import { AppCallResponse, AppsState } from '../types';
import { newOKCallResponseWithData } from '../utils/call-responses';

export const getBindings = async (request: Request, response: Response) => {
    const callRequest = request.body;
    const bindings: AppsState[] = await getAppBindings(callRequest);
    const callResponse: AppCallResponse = newOKCallResponseWithData(bindings);

    response.json(callResponse);
};

