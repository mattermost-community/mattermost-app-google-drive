import { ExtendedAppCallRequest } from 'src/types';
import { ExceptionType } from '../constant';

import { logger } from './logger';

export class Exception extends Error {
    constructor(
        public readonly type: ExceptionType,
        public readonly message: string,
        public readonly call: ExtendedAppCallRequest,
        public readonly error: object = {},
        public readonly status: number = 200,
    ) {
        super(message);

        const siteUrl: string = call.context.mattermost_site_url;
        const requestPath: string = call.path;
        const messageError = Object.keys(error).length ? JSON.stringify(error) : message;

        logger.error({ message: messageError, siteUrl, status, requestPath });
    }
}
