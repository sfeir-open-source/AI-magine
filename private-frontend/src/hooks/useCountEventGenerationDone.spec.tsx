import { renderHook } from '@testing-library/react';
import { EventsContext } from '@/src/providers/events/events.context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EventRepository } from '@/src/domain/EventRepository';
import { useCountEventGenerationDone } from '@/src/hooks/useCountEventGenerationDone';

describe('useCountEventGenerationDone', () => {
  it("calls method to retrieve an event's count of generations done", () => {
    const getCountEventGenerationDoneMock = vi.fn().mockReturnValue({});

    renderHook(() => useCountEventGenerationDone('123'), {
      wrapper: ({ children }) => {
        return (
          <QueryClientProvider client={new QueryClient()}>
            <EventsContext.Provider
              value={
                {
                  getCountEventGenerationDone: getCountEventGenerationDoneMock,
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
