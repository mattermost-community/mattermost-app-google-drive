import path from 'path';

import { createLogger, format, transports } from 'winston';

const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};
const customFormat = format.combine(
    format.timestamp(),
    format.printf((info) => {
        return `{ "site_url": "${info.siteUrl}", "${info.level}": "${info.message}", "status: "${info.status}", "timestamp": "${info.timestamp}" }`;
    })
);

export const logger = createLogger({
    levels: logLevels,
    format: customFormat,
    transports: [new transports.Console()],
});