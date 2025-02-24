import { AppLayout } from '@/src/components/app-layout/app-layout';
import { NavLink, useParams } from 'react-router';
import { useEventById } from '@/src/hooks/useEventById';
import { EventPromptForm } from '@/src/components/event-prompt-form/event-prompt-form';
import { LoadingSpinner } from '@/src/components/loading-spinner/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export const EventPromptPage = () => {
  const { t } = useTranslation();
  const { eventId } = useParams<{ eventId: string }>();

  const { data: event, error, isFetching } = useEventById(eventId);

  if (error) {
    return (
      <AppLayout>
        <Alert variant="destructive" className="mt-12">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Error while retrieving event: {error.message}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button asChild variant="link">
            <NavLink to="/events">{t('return-to-event-selection')}</NavLink>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {isFetching ? (
        <div className="flex justify-center mt-12">
          <LoadingSpinner width={96} height={96}/>
        </div>
      ) : (
        event && <EventPromptForm event={event} />
      )}
    </AppLayout>
  );
};
