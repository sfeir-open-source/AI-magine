import { renderHook, waitFor } from '@testing-library/react';
import { EventsContext } from '@/src/providers/events/events.context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EventRepository } from '@/src/domain/EventRepository';
import { useEventSelectedImages } from '@/src/hooks/useEventSelectedImages';

describe('useEventSelectedImages', () => {
  it('calls api to get promoted images', async () => {
    const fakeResponse = [
      { id: '1', url: 'url', prompt: 'prompt', author: 'nickname' },
    ];

    const { result } = renderHook(() => useEventSelectedImages('event-id'), {
      wrapper: ({ children }) => (
        <EventsContext.Provider
          value={
            {
              getPromotedImagesForEvent: vi
                .fn()
                .mockResolvedValue(fakeResponse),
            } as unknown as EventRepository
          }
        >
          <QueryClientProvider client={new QueryClient()}>
            {children}
          </QueryClientProvider>
        </EventsContext.Provider>
      ),
    });

    await waitFor(() => expect(result.current.data).toEqual(fakeResponse));
  });
});
