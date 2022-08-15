import express, { Router } from 'express';

const router: Router = express.Router();

const staticRouter = express.Router();
staticRouter.use(express.static('static'));
router.use('/static', staticRouter);

export default router;
