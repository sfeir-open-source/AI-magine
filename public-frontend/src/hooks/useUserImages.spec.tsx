import { renderHook, waitFor } from '@testing-library/react';
import { useUserImages } from '@/src/hooks/useUserImages';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EventsContext } from '@/src/providers/events/events.context';
import { EventRepository } from '@/src/domain/EventRepository';
import { Image } from '@/src/domain/Image';
import { expect, Mock } from 'vitest';
import { useParams } from 'react-router';

vi.mock('react-router');

describe('useUserImages', () => {
  it('calls backend to retrieve user images', async () => {
    const fakeResult = [new Image('id', 'prompt', 'url', false)];
    const getImagesForUserMock = vi.fn().mockResolvedValue(fakeResult);

    const fakeUserId = 'user-id';
    const fakeEventId = 'event-id';
    (useParams as Mock).mockReturnValue({
      userId: fakeUserId,
      eventId: fakeEventId,
    });

    const { result } = renderHook(() => useUserImages(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={new QueryClient()}>
          <EventsContext.Provider
            value={
              {
                getImagesForUser: getImagesForUserMock,
              } as unknown as EventRepository
            }
          >
            {children}
          </EventsContext.Provider>
        </QueryClientProvider>
      ),
    });

    await waitFor(() => expect(result.current.data).toEqual(fakeResult));
  });
});
