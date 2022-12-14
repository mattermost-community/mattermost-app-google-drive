import { AppCallRequest } from './apps';
import { Schema$File } from './google';

export type ShareFileFunction = (call: AppCallRequest, file: Schema$File, channelId: string) => void;