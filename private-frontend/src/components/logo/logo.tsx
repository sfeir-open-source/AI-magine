import { LogoProps } from '@/src/components/logo/logo.props';
import i18n from "i18next";

export const Logo = (props: LogoProps) => (
  <img src="/logo.png" alt={i18n.t('common.logoAlt')} {...props} />
);
