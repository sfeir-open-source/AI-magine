import { renderHook, waitFor } from '@testing-library/react';
import { useImagePromotionMutation } from '@/src/hooks/useImagePromotionMutation';
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from '@tanstack/react-query';
import { expect, Mock } from 'vitest';
import { PropsWithChildren } from 'react';
import { EventsContext } from '@/src/providers/events/events.context';
import { EventRepository } from '@/src/domain/EventRepository';
import { useParams } from 'react-router';
import { getUserImagesQueryKey } from '@/src/hooks/useUserImages';

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal()),
  useQueryClient: vi.fn(),
}));

vi.mock('react-router');

describe('useImagePromotionMutation', () => {
  it('calls backend to promote user image and invalidate userImages query', async () => {
    const invalidateQueriesMock = vi.fn();
    (useQueryClient as Mock).mockReturnValue({
      invalidateQueries: invalidateQueriesMock,
    });

    const fakeUserId = 'user-id';
    const fakeEventId = 'event-id';
    (useParams as Mock).mockReturnValue({
      userId: fakeUserId,
      eventId: fakeEventId,
    });

    const promoteUserImageMock = vi.fn().mockResolvedValue('ok');

    const { result } = renderHook(() => useImagePromotionMutation(), {
      wrapper: ({ children }: PropsWithChildren) => (
        <QueryClientProvider client={new QueryClient()}>
          <EventsContext.Provider
            value={
              {
                promoteUserImage: promoteUserImageMock,
              } as unknown as EventRepository
            }
          >
            {children}
          </EventsContext.Provider>
        </QueryClientProvider>
      ),
    });

    const fakeImageId = 'fake-image-id';
    result.current.mutate({ imageId: fakeImageId });

    await waitFor(() => expect(promoteUserImageMock).toHaveBeenCalled());
    expect(invalidateQueriesMock).toHaveBeenCalledWith({
      queryKey: getUserImagesQueryKey(fakeEventId, fakeUserId),
    });
  });
});
