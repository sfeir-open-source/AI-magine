import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';
import * as React from 'react';

type ProgressButtonProps = PropsWithChildren<{
  progress: number;
  className?: string;
}> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ProgressButton = ({
  progress,
  children,
  className,
  ...buttonProps
}: ProgressButtonProps) => {
  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <div className="relative w-full">
        <div
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 rounded-lg"
          style={{ width: `${progress}%` }}
          data-testid="progress-background"
        />
        <Button
          className={cn(
            'relative w-full overflow-hidden text-white',
            className
          )}
          disabled={progress > 0}
          {...buttonProps}
        >
          {children}
        </Button>
      </div>
    </div>
  );
};
