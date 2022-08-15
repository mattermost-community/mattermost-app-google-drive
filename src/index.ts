import express, {Express} from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import config from './config';

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(morgan('tiny'))

const port: number = config.APP.PORT;
app.listen(port, () => console.log('Listening on ' + port));

