import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

export const PromoteIcon = ({
  selected,
  className,
}: {
  selected: boolean;
  className?: string;
}) => {
  return (
    <Star
      data-testid="promote-icon"
      className={cn(
        'h-4 w-4 mr-2',
        selected && 'fill-yellow-300 text-yellow-300',
        className
      )}
    />
  );
};
