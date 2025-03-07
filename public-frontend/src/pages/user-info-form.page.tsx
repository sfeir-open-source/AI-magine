import { NavLink, useParams } from 'react-router';
import { useEventById } from '@/src/hooks/useEventById';
import { UserInfoForm } from '@/src/components/user-info-form/user-info-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, LoaderCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export const UserInfoFormPage = () => {
  const { t } = useTranslation();
  const { eventId } = useParams<{ eventId: string }>();

  const { data: event, error, isFetching } = useEventById(eventId);

  if (error) {
    return (
      <>
        <Alert variant="destructive" className="mt-12">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('error')}</AlertTitle>
          <AlertDescription>
            {t('error-retrieving-event')}: {error.message}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button asChild variant="link">
            <NavLink to="/events">{t('return-to-event-selection')}</NavLink>
          </Button>
        </div>
      </>
    );
  }

  return isFetching ? (
    <div className="flex justify-center mt-12">
      <LoaderCircle
        width={96}
        height={96}
        className="animate-spin"
        data-testid="loader-circle"
      />
    </div>
  ) : (
    event && <UserInfoForm event={event} />
  );
};
