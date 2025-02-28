import { IntlProvider as BaseIntlProvider } from 'react-intl';
import { PropsWithChildren, useState } from 'react';
import { messages, SupportedLocales } from '@/src/config/i18n';

export function I18nProvider({ children }: PropsWithChildren) {
  const [locale] = useState<SupportedLocales>('en');

  return (
    <BaseIntlProvider messages={messages[locale]} locale={locale}>
      {children}
    </BaseIntlProvider>
  );
}
