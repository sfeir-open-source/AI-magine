import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';

interface EventFormProps {
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
}

// Generate time options (every 30 minutes)
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      options.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return options;
};

export function EventForm({ onSubmit, isSubmitting }: EventFormProps) {
  const { t } = useTranslation();

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);

  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const timeOptions = generateTimeOptions();

  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');

  return (
    <form action={onSubmit}>
      <Card>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('event-name')} *</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue=""
              placeholder={t('event-name-placeholder')}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('start-date')} *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate
                      ? format(startDate, 'dd/MM/yyyy')
                      : t('select-date')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <input
                type="hidden"
                name="startDate"
                value={startDate ? format(startDate, 'dd/MM/yyyy') : ''}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>{t('start-time')} *</Label>
              <Select defaultValue={startTime} onValueChange={setStartTime}>
                <SelectTrigger>
                  <SelectValue placeholder={t('select-time')} />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={`start-${time}`} value={time}>
                      {format(new Date(`2000-01-01T${time}`), 'HH:mm')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                name="startTime"
                value={startTime}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('end-date')} *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'dd/MM/yyyy') : t('select-date')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <input
                type="hidden"
                name="endDate"
                value={endDate ? format(endDate, 'dd/MM/yyyy') : ''}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>{t('end-time')} *</Label>
              <Select defaultValue={endTime} onValueChange={setEndTime}>
                <SelectTrigger>
                  <SelectValue placeholder={t('select-time')} />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={`end-${time}`} value={time}>
                      {format(new Date(`2000-01-01T${time}`), 'HH:mm')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="endTime" value={endTime} required />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" asChild>
            <NavLink to="/">{t('cancel')}</NavLink>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? `${t('saving')}...` : t('create-event')}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
