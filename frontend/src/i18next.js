import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './locales/index.js';

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru', // дефолтная локаль - ru, автоматическое определение языка не используется
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false, // экранирование уже есть в React, поэтому отключаем
    },
  });

export default i18next;