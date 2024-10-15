import path from 'path';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru', 'kk'],
    backend: {
      loadPath: path.join(__dirname, '../locales/{{lng}}.json'),
    },
    detection: {
      order: ['querystring', 'cookie', 'header'],
      caches: ['cookie'],
    },
  });

export default i18next;
