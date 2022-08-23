import express, { Router } from 'express';
import { Routes } from '../constant';
import * as cManifest from './manifest';
import * as cBindings from './bindings';
import * as cInstall from './install';
import * as cHelp from './help';
import * as cConfigure from './configure';
import * as cConnect from './connect';

const router: Router = express.Router();

router.get(Routes.App.ManifestPath, cManifest.getManifest);
router.post(Routes.App.BindingsPath, cBindings.getBindings);
router.post(Routes.App.InstallPath, cInstall.getInstall);
router.post(Routes.App.CallPathHelp, cHelp.getHelp);

// Configure Google Client
router.post(Routes.App.CallPathConfigForm, cConfigure.configureGoogleClient);
router.post(Routes.App.CallPathUpdateConfigForm, cConfigure.configureGoogleClient);
router.post(Routes.App.CallPathConfigSubmit, cConfigure.configureGoogleClientSubmit);

// Connect User's Google account
router.post(`${Routes.App.CallPathConnectSubmit}`, cConnect.getConnectGoogleURL);
router.post(`${Routes.App.OAuthConnectPath}`, cConnect.fOauth2Connect);
router.post(`${Routes.App.OAuthCompletePath}`, cConnect.fOauth2Complete);
router.post(`${Routes.App.CallPathDisconnectSubmit}`, cConnect.doDisconnectGoogle);

const staticRouter = express.Router();
staticRouter.use(express.static('static'));
router.use('/static', staticRouter);

export default router;
