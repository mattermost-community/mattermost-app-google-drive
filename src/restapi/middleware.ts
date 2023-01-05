import { Request, Response } from 'express';
import { AppActingUser, ExtendedAppCallRequest } from '../types';
import { newErrorCallResponseWithMessage } from '../utils/call-responses';
import { configureI18n } from '../utils/translations';
import { isUserSystemAdmin } from '../utils/utils';

export const requireSystemAdmin = (req: Request, res: Response, next: () => void) => {
   const call: ExtendedAppCallRequest = req.body as ExtendedAppCallRequest;
   const i18nObj = configureI18n(call.context);
   const actingUser: AppActingUser = call.context.acting_user as AppActingUser;

   if (!actingUser) {
      res.json(newErrorCallResponseWithMessage(i18nObj.__('general.validation-user.not-provided')));
      return;
   }

   if (!isUserSystemAdmin(actingUser)) {
      res.json(newErrorCallResponseWithMessage(i18nObj.__('general.validation-user.system-admin')));
      return;
   }
   
   next();
};