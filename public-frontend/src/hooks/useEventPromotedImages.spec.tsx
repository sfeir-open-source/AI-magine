import { renderHook, waitFor } from '@testing-library/react';
import { useEventPromotedImages } from '@/src/hooks/useEventPromotedImages';
import { EventsContext } from '@/src/providers/events/events.context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EventRepository } from '@/src/domain/EventRepository';
import { ImageWithPromptTextAndAuthorDto } from '@/src/providers/events/dto/ImageWithPromptTextAndAuthor.dto';
import { Mock } from 'vitest';
import { useParams } from 'react-router';

vi.mock('react-router');

describe('useEventPromotedImages', () => {
  it('calls api to get promoted images', async () => {
    (useParams as Mock).mockReturnValue({ eventId: 'event-id' });

    const fakeResponse = [
      new ImageWithPromptTextAndAuthorDto('1', 'url', 'prompt', 'nickname'),
    ];

    const { result } = renderHook(() => useEventPromotedImages(), {
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
