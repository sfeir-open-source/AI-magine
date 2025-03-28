import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useCountEventGenerationDone } from '@/src/hooks/useCountEventGenerationDone';
import { useCountEventGenerationError } from '@/src/hooks/useCountEventGenerationError';
import { AlertTriangle, ImageIcon, LucideIcon, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MetricsCard = ({
  title,
  colorClass,
  value,
  Icon,
  isFetching,
}: {
  title: string;
  colorClass: string;
  value: number;
  Icon: LucideIcon;
  isFetching: boolean;
}) => (
  <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
    <div className="flex items-center gap-2">
      <Icon className={cn('h-5 w-5', colorClass)} />
      <h3 className="font-medium">{title}</h3>
    </div>
    <p className="mt-2 text-2xl font-bold">{isFetching ? '...' : value}</p>
  </div>
);

export const EventMetrics = ({ eventId }: { eventId: string }) => {
  const { t } = useTranslation();

  const { data: doneCount, isFetching: isFetchingDoneCount } =
    useCountEventGenerationDone(eventId);
  const { data: errorsCount, isFetching: isFetchingErrorsCount } =
    useCountEventGenerationError(eventId);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('activity-metrics')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricsCard
            title={t('total-users')}
            colorClass="text-blue-500"
            value={0}
            Icon={Users}
            isFetching={false}
          />
          <MetricsCard
            title={t('images-generated')}
            colorClass="text-green-500"
            value={doneCount ?? 0}
            Icon={ImageIcon}
            isFetching={isFetchingDoneCount}
          />
          <MetricsCard
            title={t('errors')}
            colorClass="text-red-500"
            value={errorsCount ?? 0}
            Icon={AlertTriangle}
            isFetching={isFetchingErrorsCount}
          />
        </div>
      </CardContent>
    </Card>
  );
};
