import {ExceptionType} from '../constant';

export class Exception extends Error {
    constructor(
        public readonly type: ExceptionType,
        public readonly message: string
    ) {
        super(message);
    }
}
