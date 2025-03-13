import { renderHook, waitFor } from '@testing-library/react';
import { useRemainingPromptsCount } from '@/src/hooks/useRemainingPromptsCount';
import { UsersContext } from '@/src/providers/users/users.context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { expect, Mock } from 'vitest';
import { useUserId } from '@/src/hooks/useUserId';

vi.mock('@/src/hooks/useUserId');
vi.mock('react-router');

describe('useRemainingPromptsCount', () => {
  it('calls users provider to retrieve remaining prompts count', async () => {
    const fakeEventId = 'event-id';
    (useParams as Mock).mockReturnValue({ eventId: fakeEventId });

    const fakeUserId = 'user-id';
    (useUserId as Mock).mockReturnValue(fakeUserId);

    const getRemainingPromptsCountForUserAndEventMock = vi
      .fn()
      .mockReturnValue(5);

    const { result } = renderHook(() => useRemainingPromptsCount(), {
      wrapper: ({ children }) => (
        <UsersContext.Provider
          value={{
            getRemainingPromptsCountForUserAndEvent:
              getRemainingPromptsCountForUserAndEventMock,
          }}
        >
          <QueryClientProvider client={new QueryClient()}>
            {children}
          </QueryClientProvider>
        </UsersContext.Provider>
      ),
    });

    await waitFor(() => expect(result.current.data).toEqual(5));
  });
});
