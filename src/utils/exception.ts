import { ExceptionType } from '../constant';

import { logger } from './logger';

export class Exception extends Error {
    constructor(
        public readonly type: ExceptionType,
        public readonly message: string,
        public readonly siteUrl: string,
        public readonly error: object = {},
        public readonly status: number = 200,
    ) {
        super(message);

        if (Object.keys(error).length) {
            logger.error({ message: JSON.stringify(error), siteUrl, status });
        } else {
            logger.error({ message, siteUrl, status });
        }
    }
}
