import { renderHook } from '@testing-library/react';
import { useCreateEventPromptMutation } from '@/src/hooks/useCreateEventPromptMutation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EventsContext } from '@/src/providers/events/events.context';
import { EventRepository } from '@/src/domain/EventRepository';

describe('useEventPromptMutation', () => {
  it('calls a method to send a new prompt', async () => {
    const sendPromptForEventMock = vi.fn().mockResolvedValue('prompt-id');

    const { result } = renderHook(() => useCreateEventPromptMutation(), {
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
      userId: 'user-id',
      prompt: 'prompt',
    });

    expect(promptId).toEqual('prompt-id');
    expect(sendPromptForEventMock).toHaveBeenCalled();
  });
});
