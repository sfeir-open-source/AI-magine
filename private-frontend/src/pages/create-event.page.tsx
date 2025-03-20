import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink, useNavigate } from 'react-router';
import { EventForm } from '@/src/components/event-form/event-form';
import { useTranslation } from 'react-i18next';
import { parse } from 'date-fns';
import { useCreateEventMutation } from '@/src/hooks/useCreateEventMutation';

export const CreateEventPage = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { mutateAsync: createEvent, isPending } = useCreateEventMutation();

  const handleSubmit = async (formData: FormData) => {
    const name = formData.get('name') as string;
    const startDate = formData.get('startDate') as string;
    const startTime = formData.get('startTime') as string;
    const endDate = formData.get('endDate') as string;
    const endTime = formData.get('endTime') as string;

    const startDateTimestamp = parse(
      `${startDate} ${startTime}`,
      'dd/MM/yyyy HH:mm',
      new Date()
    ).getTime();

    const endDateTimestamp = parse(
      `${endDate} ${endTime}`,
      'dd/MM/yyyy HH:mm',
      new Date()
    ).getTime();

    try {
      const newEvent = await createEvent({
        name,
        startDateTimestamp,
        endDateTimestamp,
      });

      navigate(`/events/${newEvent.id}`);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  return (
    <div className="container py-10 mx-auto md:px-10 px-4">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <NavLink to="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back-to-dashboard')}
          </NavLink>
        </Button>
      </div>

      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold">{t('create-new-event')}</h1>
        <EventForm onSubmit={handleSubmit} isSubmitting={isPending} />
      </div>
    </div>
  );
};
