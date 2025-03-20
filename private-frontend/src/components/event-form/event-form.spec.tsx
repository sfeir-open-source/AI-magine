import { EventForm } from '@/src/components/event-form/event-form';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import i18n from '@/src/config/i18n';
import { MemoryRouter } from 'react-router';
import { expect } from 'vitest';
import { format } from 'date-fns';

describe('EventForm', () => {
  it('submits form values to create an event', async () => {
    const onSubmitMock = vi.fn();

    render(
      <MemoryRouter>
        <EventForm onSubmit={onSubmitMock} isSubmitting={false} />
      </MemoryRouter>
    );

    await userEvent.type(
      screen.getByLabelText(`${i18n.t('event-name')} *`),
      'event name'
    );

    await userEvent.click(screen.getAllByText(i18n.t('select-date'))[0]);
    await userEvent.click(screen.getByText('12'));

    await userEvent.click(screen.getByText(i18n.t('select-date')));
    await userEvent.click(screen.getByText('13'));

    await userEvent.click(screen.getByText(i18n.t('create-event')));

    const formData = onSubmitMock.mock.calls[0][0];

    const currentMonth = format(new Date(), 'MM');
    const currentYear = format(new Date(), 'yyyy');

    expect(formData.get('name')).toEqual('event name');
    expect(formData.get('startDate')).toEqual(
      `12/${currentMonth}/${currentYear}`
    );
    expect(formData.get('startTime')).toEqual('09:00');
    expect(formData.get('endDate')).toEqual(
      `13/${currentMonth}/${currentYear}`
    );
    expect(formData.get('endTime')).toEqual('18:00');
  });
});
