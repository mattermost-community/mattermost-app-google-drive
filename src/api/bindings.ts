import {Request, Response} from 'express';

import {getAppBindings} from '../bindings';
import {AppCallResponse, AppsState} from '../types';
import {newOKCallResponseWithData} from '../utils/call-responses';

export const getBindings = async (request: Request, response: Response) => {
    const context = request.body;
    const bindings: AppsState[] = await getAppBindings(context);
    const callResponse: AppCallResponse = newOKCallResponseWithData(bindings);

    response.json(callResponse);
};

