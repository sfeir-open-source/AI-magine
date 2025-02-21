import { HTMLAttributes, PropsWithChildren } from 'react';
import { clsx } from 'clsx';

export const TypographyH1 = ({
  children,
  className,
  ...headingProps
}: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) => {
  return (
    <h1
      className={clsx(
        'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
        className
      )}
      {...headingProps}
    >
      {children}
    </h1>
  );
};
