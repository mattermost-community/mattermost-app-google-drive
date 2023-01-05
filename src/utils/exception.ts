import { ExceptionType } from '../constant';
import { logger } from './logger';

export class Exception extends Error {
    constructor(
        public readonly type: ExceptionType,
        public readonly message: string,
        public readonly siteUrl: string,
        public readonly status: number = 200,
    ) {
        super(message);

        logger.error({ message: message, siteUrl, status });
    }
}
