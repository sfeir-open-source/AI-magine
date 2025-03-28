import { renderHook } from '@testing-library/react';
import { EventsContext } from '@/src/providers/events/events.context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EventRepository } from '@/src/domain/EventRepository';
import { useCountEventGenerationError } from '@/src/hooks/useCountEventGenerationError';

describe('useCountEventGenerationError', () => {
  it("calls method to retrieve an event's count of generation errors", () => {
    const getCountEventGenerationErrorMock = vi.fn().mockReturnValue({});

    renderHook(() => useCountEventGenerationError('123'), {
      wrapper: ({ children }) => {
        return (
          <QueryClientProvider client={new QueryClient()}>
            <EventsContext.Provider
              value={
                {
                  getCountEventGenerationError:
                    getCountEventGenerationErrorMock,
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
