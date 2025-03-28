import { renderHook } from '@testing-library/react';
import { useCountEventGenerationRequested } from '@/src/hooks/useEventGenerationRequestedCount';
import { EventsContext } from '@/src/providers/events/events.context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EventRepository } from '@/src/domain/EventRepository';

describe('useEventGenerationRequestedCount', () => {
  it("calls method to retrieve an event's count of generation requested", () => {
    const getEventGenerationRequestedCountMock = vi.fn().mockReturnValue({});

    renderHook(() => useCountEventGenerationRequested('123'), {
      wrapper: ({ children }) => {
        return (
          <QueryClientProvider client={new QueryClient()}>
            <EventsContext.Provider
              value={
                {
                  getEventGenerationRequestedCount:
                    getEventGenerationRequestedCountMock,
                } as unknown as EventRepository
              }
            >
              {children}
            </EventsContext.Provider>
          </QueryClientProvider>
        );
      },
    });
  });
});
