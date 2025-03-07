import { renderHook } from '@testing-library/react';
import { useCreateUserMutation } from '@/src/hooks/useCreateUserMutation';
import { EventsContext } from '@/src/providers/events/events.context';
import {
  CreateEventUserRequest,
  EventRepository,
} from '@/src/domain/EventRepository';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('useCreateUserMutation', () => {
  it('calls event provider to create a user', async () => {
    const createUserForEventMock = vi.fn();

    const { result } = renderHook(() => useCreateUserMutation(), {
      wrapper: ({ children }) => (
        <EventsContext.Provider
          value={
            {
              createUserForEvent: createUserForEventMock,
            } as unknown as EventRepository
          }
        >
          <QueryClientProvider client={new QueryClient()}>
            {children}
          </QueryClientProvider>
        </EventsContext.Provider>
      ),
    });

    const fakePayload: CreateEventUserRequest = {
      userEmail: 'foo@foo.com',
      userNickname: 'nickname',
      browserFingerprint: 'fp',
      allowContact: false,
    };

    await result.current.mutateAsync(fakePayload);

    expect(createUserForEventMock).toHaveBeenCalledWith(fakePayload);
  });
});
