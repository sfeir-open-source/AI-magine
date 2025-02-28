import { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

export const TypographyLead = ({
  children,
  className,
  ...paragraphProps
}: PropsWithChildren<HTMLAttributes<HTMLParagraphElement>>) => {
  return (
    <p
      className={cn('text-xl text-muted-foreground', className)}
      {...paragraphProps}
    >
      {children}
    </p>
  );
};
