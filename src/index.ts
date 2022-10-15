const serverless = require('serverless-http');

import express, { Express } from 'express';
import bodyParser from 'body-parser';
import config from './config';
import morgan from 'morgan';
import apiRoutes from './api';

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(morgan('tiny'))
app.use('/', apiRoutes);

const port: number = config.APP.PORT;
app.listen(port, () => console.log('Listening on ' + port));

const handler = serverless(app, { provider: 'aws' });
module.exports.handler = async (context: any, req: any) => {
  context.res = await handler(context, req);
}