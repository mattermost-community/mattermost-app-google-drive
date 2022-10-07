import path from "path";
const i18n = require("i18n");

export const configureI18n = (isGlobal: boolean) => {
   let i18nObj: any = { };

   i18n.configure({
      locales: ["es", "es"],
      register: isGlobal ? global : i18nObj,
      directory: path.join(__dirname, "../locales"),
      defaultLocale: "en",
      autoReload: true,
      objectNotation: true,
      updateFiles: false,
   });

   return [i18n, i18nObj];
};

// USAGE
// import { configureI18n } from '../utils/translations';
// const [_, i18nObj] = configureI18n(false);
// i18nObj.setLocale('es');