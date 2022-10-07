import { I18n } from "i18n";
import path from "path";
import { LOCALES } from "../constant/locales";
import { AppContext } from "../types";
const i18n = require("i18n");

export const configureI18n = (context?: AppContext) => {
   const locale = context?.locale || LOCALES.ENGLISH;

   const i18n = new I18n({
      locales: [
         LOCALES.ENGLISH,
         LOCALES.SPANISH
      ],
      directory: path.join(__dirname, "../locales"),
      objectNotation: true,
      defaultLocale: locale
   });

   return i18n;
};

// USAGE 
/*
   const i18nObj = configureI18n(context);
   i18nObj.__('configure-binding.form.fields.serviceAccount.description'),
*/
