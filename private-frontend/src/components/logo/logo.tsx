import { LogoProps } from '@/src/components/logo/logo.props';

export const Logo = (props: LogoProps) => (
  <img src="/logo.png" alt={props?.alt || 'Logo'} {...props} />
);
