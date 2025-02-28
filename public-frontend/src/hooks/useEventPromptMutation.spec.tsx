import { renderHook } from '@testing-library/react';
import { useEventPromptMutation } from '@/src/hooks/useEventPromptMutation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EventsContext } from '@/src/providers/events/events.context';
import { EventRepository } from '@/src/domain/EventRepository';
import { expect } from 'vitest';

describe('useEventPromptMutation', () => {
  it('calls a method to send a new prompt', async () => {
    const sendPromptForEventMock = vi.fn().mockResolvedValue('prompt-id');

    const { result } = renderHook(() => useEventPromptMutation(), {
      wrapper: ({ children }) => {
        return (
          <QueryClientProvider client={new QueryClient()}>
            <EventsContext.Provider
              value={
                {
                  sendPromptForEvent: sendPromptForEventMock,
                } as unknown as EventRepository
              }
            >
              {children}
            </EventsContext.Provider>
          </QueryClientProvider>
        );
      },
    });

    const promptId = await result.current.mutateAsync({
      eventId: 'event-id',
      browserFingerprint: 'fp',
      userName: 'name',
      userEmail: 'email',
      prompt: 'prompt',
      jobTitle: 'job',
      allowContact: false,
    });

    expect(promptId).toEqual('prompt-id');
    expect(sendPromptForEventMock).toHaveBeenCalled();
  });
});
