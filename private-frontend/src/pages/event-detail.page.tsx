import { Calendar, ArrowLeft, SquareArrowOutUpRight } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { NavLink, useParams } from 'react-router';
import { useEventById } from '@/src/hooks/useEventById';
import { EventMetrics } from '@/src/components/event-metrics/event-metrics';
import { EventSelectedImages } from '@/src/components/event-selected-images/event-selected-images';
import { useTranslation } from 'react-i18next';

export const EventDetailPage = () => {
  const { t } = useTranslation();

  const params = useParams<{ eventId: string }>();

  const { data: event, isFetching } = useEventById(params.eventId);

  if (isFetching) {
    return (
      <div className="container flex h-[50vh] items-center justify-center mx-auto">
        <div className="text-center">
          <h2 className="text-xl">{t('loading-event-details')}...</h2>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container flex h-[50vh] items-center justify-center mx-auto">
        <div className="text-center">
          <h2 className="text-xl">{t('event-not-found')}</h2>
          <p className="mt-2 text-muted-foreground">
            {t('event-not-found-description')}
          </p>
          <Button asChild className="mt-4">
            <NavLink to="/events">{t('go-back-to-dashboard')}</NavLink>
          </Button>
        </div>
      </div>
    );
  }

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const isPast = endDate < new Date();

  return (
    <div className="container py-10 mx-auto md:px-10 px-4">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" asChild>
          <NavLink to="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back-to-dashboard')}
          </NavLink>
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>
              <Button variant="link" asChild className="has-[>svg]:px-0">
                <a
                  href={`${import.meta.env.VITE_PUBLIC_FRONTEND_URL}/events/${event.id}/gallery`}
                >
                  <h3 className="text-xl font-semibold">{event.name}</h3>
                  <SquareArrowOutUpRight />
                </a>
              </Button>
            </CardTitle>
            <CardDescription>
              {isPast ? t('event-has-ended') : t('event-is-active')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-mono text-muted-foreground">
                  ID: {event.id}
                </p>
              </div>

              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                <div className="flex items-center gap-1">
                  <h4 className="font-medium">{t('start-date')}:</h4>
                  <p className="text-muted-foreground">
                    {format(startDate, 'dd/MM/yyyy')} {t('at')}{' '}
                    {format(startDate, 'HH:mm:ss')}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                <div className="flex items-center gap-1">
                  <h4 className="font-medium">{t('end-date')}:</h4>
                  <p className="text-muted-foreground">
                    {format(endDate, 'dd/MM/yyyy')} {t('at')}{' '}
                    {format(endDate, 'HH:mm:ss')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <EventMetrics eventId={params.eventId ?? ''} />
      </div>
      <EventSelectedImages eventId={params.eventId ?? ''} />
    </div>
  );
};
