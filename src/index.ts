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
app.post('/ping', (req, res) => { res.json({}) })

// App released via HTTP and docker
if (config.APP.HOST) {
    const port: number = config.APP.PORT;
    app.listen(port, () => console.log('Listening on ' + port));
}
// App released via AWS Lambda
else {
    module.exports.handler = serverless(app);
}
