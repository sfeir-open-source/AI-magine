import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EventsContext } from '@/src/providers/events/events.context';
import { EventRepository } from '@/src/domain/EventRepository';
import { useCreateEventMutation } from '@/src/hooks/useCreateEventMutation';

describe('useCreateEventMutation', () => {
  it('calls a method to create a new event', async () => {
    const fakeEvent = {
      name: 'event-name',
      startDateTimestamp: 1,
      endDateTimestamp: 2,
    };
    const createEventMock = vi
      .fn()
      .mockResolvedValue({ id: '1', ...fakeEvent });

    const { result } = renderHook(() => useCreateEventMutation(), {
      wrapper: ({ children }) => {
        return (
          <QueryClientProvider client={new QueryClient()}>
            <EventsContext.Provider
              value={
                {
                  createEvent: createEventMock,
                } as unknown as EventRepository
              }
            >
              {children}
            </EventsContext.Provider>
          </QueryClientProvider>
        );
      },
    });

    const event = await result.current.mutateAsync({
      name: 'event-name',
      startDateTimestamp: 1,
      endDateTimestamp: 2,
    });

    expect(event).toEqual({ id: '1', ...fakeEvent });
    expect(createEventMock).toHaveBeenCalled();
  });
});
