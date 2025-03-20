import { CreateEventPage } from '@/src/pages/create-event.page';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Mock } from 'vitest';
import { useCreateEventMutation } from '@/src/hooks/useCreateEventMutation';
import { MemoryRouter } from 'react-router';

vi.mock('@/src/components/event-form/event-form', () => ({
  EventForm: ({ onSubmit }) => {
    return (
      <button
        onClick={() => {
          const formData = new FormData();
          formData.set('name', 'event name');
          formData.set('startDate', '12/03/2025');
          formData.set('endDate', '13/03/2025');
          formData.set('startTime', '09:00');
          formData.set('endTime', '18:00');
          onSubmit(formData);
        }}
      >
        create event
      </button>
    );
  },
}));

vi.mock('@/src/hooks/useCreateEventMutation');

describe('CreateEventPage', () => {
  it('calls method to create an event', async () => {
    const mutateAsyncMock = vi.fn();

    (useCreateEventMutation as Mock).mockReturnValue({
      mutateAsync: mutateAsyncMock,
    });

    render(
      <MemoryRouter>
        <CreateEventPage />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByText('create event'));

    expect(mutateAsyncMock).toHaveBeenCalledWith({
      endDateTimestamp: 1741885200000,
      name: 'event name',
      startDateTimestamp: 1741766400000,
    });
  });
});
