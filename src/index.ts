import express, { Express } from 'express';
import bodyParser from 'body-parser';
import config from './config';
import morgan from 'morgan';
import apiRoutes from './api';
import { configureI18n } from './utils/translations';


const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(morgan('tiny'))
app.use('/', apiRoutes);

const i18n = configureI18n();
app.use(i18n.init);

const port: number = config.APP.PORT;
app.listen(port, () => console.log('Listening on ' + port));

