import { PrimitiveType, useIntl } from 'react-intl';

export const useTranslations = () => {
  const { formatMessage } = useIntl();
  return {
    t: (key: string, options: Record<string, PrimitiveType> | undefined) =>
      formatMessage({ id: key }, options),
  };
};
