import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NavLink } from 'react-router';
import { EventCard } from '../components/event-card/event-card';
import {
  pastEventsSelector,
  todayEventsSelector,
  upcomingEventsSelector,
  useEventList,
} from '@/src/hooks/useEventList';
import { useTranslation } from 'react-i18next';

export const EventListPage = () => {
  const { t } = useTranslation();

  const { data: todayEvents } = useEventList(todayEventsSelector);
  const { data: upcomingEvents } = useEventList(upcomingEventsSelector);
  const { data: pastEvents } = useEventList(pastEventsSelector);

  return (
    <div className="container py-10 mx-auto md:px-10 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('event-management')}</h1>
        <NavLink to="/events/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('create-event')}
          </Button>
        </NavLink>
      </div>

      {(todayEvents?.length ?? 0) > 0 && (
        <div className="mt-8">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle>
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  {t('today-events')}
                </h3>
              </CardTitle>
              <CardDescription>{t('events-happening-today')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {todayEvents?.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-8">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">{t('upcoming-events')}</TabsTrigger>
            <TabsTrigger value="past">{t('past-events')}</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            {(upcomingEvents?.length ?? 0) > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents?.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p>{t('no-upcoming-events')}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="past">
            {(pastEvents?.length ?? 0) > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pastEvents?.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p>{t('no-past-events')}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
