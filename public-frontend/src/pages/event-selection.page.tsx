import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChangeEvent, useState } from 'react';
import { AppLayout } from '@/src/components/app-layout/app-layout';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export const EventSelectionPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [eventId, setEventId] = useState<string>();

  const onChangeEventId = (e: ChangeEvent<HTMLInputElement>) => {
    setEventId(e.currentTarget.value);
  };

  const onValidateEventId = () => {
    navigate(`/events/${eventId}`);
  }

  return (
    <AppLayout>
      <p className="mb-16 mt-32 text-center">{t('enter-event-id')}</p>
      <div className="flex gap-4">
        <Input placeholder={t('event-identifier')} onChange={onChangeEventId} />
        <Button disabled={!eventId} onClick={onValidateEventId}>Go</Button>
      </div>
    </AppLayout>
  );
};
