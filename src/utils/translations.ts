import path from "path";
import { LOCALES } from "../constant/locales";
import { AppContext } from "../types";
const i18n = require("i18n");

export const configureI18n = (context?: AppContext) => {
   const locale = context?.locale || LOCALES.ENGLISH;
   
   i18n.configure({
      locales: [
         LOCALES.ENGLISH, 
         LOCALES.SPANISH
      ],
      register: global,
      directory: path.join(__dirname, "../locales"),
      defaultLocale: LOCALES.ENGLISH,
      autoReload: true,
      objectNotation: true,
      updateFiles: false,
   });
   i18n.setLocale(locale);

   return i18n;
};

// USAGE 
/*
   const i18n = useTranslations(context);
   i18nObj.__('configure-binding.form.fields.serviceAccount.description'),
*/



// USAGE
// import { configureI18n } from '../utils/translations';
// const [_, i18nObj] = configureI18n(false);
// i18nObj.setLocale('es');