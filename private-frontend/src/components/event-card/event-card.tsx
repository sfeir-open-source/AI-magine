import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Event } from '@/src/domain/Event';

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const { t } = useTranslation();

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const isPast = endDate < new Date();

  return (
    <Card className="gap-0">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>
            <h3 className="font-semibold tracking-tight line-clamp-1 text-xl">
              {event.name}
            </h3>
          </CardTitle>
          <Badge variant={isPast ? 'outline' : 'default'}>
            {isPast ? t('past') : t('active')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start">
            <Calendar className="mr-2 h-4 w-4 mt-0.5" />
            <div className="space-y-1">
              <div>
                <span className="font-medium">{t('start')}: </span>
                {format(startDate, 'dd/MM/yyyy HH:mm:ss')}
              </div>
              <div>
                <span className="font-medium">{t('end')}: </span>
                {format(endDate, 'dd/MM/yyyy HH:mm:ss')}
              </div>
            </div>
          </div>

          <div className="flex items-center text-xs">
            <span className="font-mono">ID: {event.id}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <NavLink to={`/events/${event.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            {t('view-details')}
          </Button>
        </NavLink>
      </CardFooter>
    </Card>
  );
};
