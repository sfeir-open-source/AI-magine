import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChangeEvent, KeyboardEvent, useState } from 'react';
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
    if (eventId) navigate(`/events/${eventId}`);
  };

  const onKeyUpEventSelectionInput = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') onValidateEventId();
  };

  return (
    <>
      <p className="mb-16 mt-32 text-center">{t('enter-event-id')}</p>
      <div className="flex gap-4">
        <Input
          placeholder={t('event-identifier')}
          onChange={onChangeEventId}
          onKeyUp={onKeyUpEventSelectionInput}
        />
        <Button disabled={!eventId} onClick={onValidateEventId}>
          Go
        </Button>
      </div>
    </>
  );
};
