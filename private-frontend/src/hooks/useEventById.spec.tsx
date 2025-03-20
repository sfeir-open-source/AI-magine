import { renderHook } from '@testing-library/react';
import { useEventById } from '@/src/hooks/useEventById';
import { EventsContext } from '@/src/providers/events/events.context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EventRepository } from '@/src/domain/EventRepository';

describe('useEventById', () => {
  it('calls method to retrieve an event by its id', () => {
    const getEventByIdMock = vi.fn().mockReturnValue({});

    renderHook(() => useEventById('123'), {
      wrapper: ({ children }) => {
        return (
          <QueryClientProvider client={new QueryClient()}>
            <EventsContext.Provider
              value={
                { getEventById: getEventByIdMock } as unknown as EventRepository
              }
            >
              {children}
            </EventsContext.Provider>
          </QueryClientProvider>
        );
      },
    });

    expect(getEventByIdMock).toHaveBeenCalledWith('123');
  });
});
