import en from '@/locales/en.json';
import fr from '@/locales/fr.json';

export const messages = {
    en,
    fr,
};

export type SupportedLocales = keyof typeof messages;
