import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LogIn } from 'lucide-react';

export const EventSelectionPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [eventId, setEventId] = useState<string>('');

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

  const onClear = () => {
    setEventId('');
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>{t('participate-to-event')}</CardTitle>
        <CardDescription>
          {t('participate-to-event-description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Input
          placeholder={t('event-identifier')}
          onChange={onChangeEventId}
          onKeyUp={onKeyUpEventSelectionInput}
          value={eventId}
          id="event-id"
        />
        <Button variant="outline" onClick={onClear}>
          {t('clear')}
        </Button>
      </CardContent>
      <CardFooter>
        <Button
          disabled={!eventId}
          onClick={onValidateEventId}
          className="w-full"
        >
          <span>{t('enter-event')}</span>
          <LogIn />
        </Button>
      </CardFooter>
    </Card>
  );
};
