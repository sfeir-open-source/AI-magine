import { renderHook, waitFor } from '@testing-library/react';
import { EventsContext } from '@/src/providers/events/events.context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EventRepository } from '@/src/domain/EventRepository';
import { useEventList } from '@/src/hooks/useEventList';

describe('useEventList', () => {
  it('calls method to retrieve a list of events', async () => {
    const fakeEvents = [{ id: 1 }, { id: 2 }];
    const getAllEventsMock = vi.fn().mockReturnValue(fakeEvents);

    const { result } = renderHook(() => useEventList(), {
      wrapper: ({ children }) => {
        return (
          <QueryClientProvider client={new QueryClient()}>
            <EventsContext.Provider
              value={
                { getAllEvents: getAllEventsMock } as unknown as EventRepository
              }
            >
              {children}
            </EventsContext.Provider>
          </QueryClientProvider>
        );
      },
    });

    expect(getAllEventsMock).toHaveBeenCalled();
    await waitFor(() => expect(result.current.data).toEqual(fakeEvents));
  });
});
