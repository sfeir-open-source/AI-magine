import { act, renderHook, waitFor } from '@testing-library/react';
import { useImageGenerationListener } from '@/src/hooks/useImageGenerationListener';
import { EventsContext } from '@/src/providers/events/events.context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EventRepository } from '@/src/domain/EventRepository';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useImageGenerationListener', () => {
  const fakeUserId = 'fake-user';

  it('returns a listen function that updates progress for image:generation-requested event', async () => {
    const listenForPromptGenerationEventMock = vi
      .fn()
      .mockImplementation(
        (
          _eventId: string,
          _promptId: string,
          onEvent: (evt: MessageEvent<string>) => void
        ) => {
          onEvent({
            data: JSON.stringify({ type: 'image:generation-requested' }),
          } as MessageEvent<string>);
        }
      );

    const { result } = renderHook(
      () => useImageGenerationListener(fakeUserId),
      {
        wrapper: ({ children }) => (
          <EventsContext.Provider
            value={
              {
                listenForPromptGenerationEvent:
                  listenForPromptGenerationEventMock,
              } as unknown as EventRepository
            }
          >
            <QueryClientProvider client={new QueryClient()}>
              {children}
            </QueryClientProvider>
          </EventsContext.Provider>
        ),
      }
    );

    act(() => result.current.listen('prompt-id'));

    await waitFor(() => expect(result.current.progress).toEqual(20));
  });

  it('returns a listen function that updates progress for image:generation-done event', async () => {
    const listenForPromptGenerationEventMock = vi
      .fn()
      .mockImplementation(
        (
          _eventId: string,
          _promptId: string,
          onEvent: (evt: MessageEvent<string>) => void
        ) => {
          onEvent({
            data: JSON.stringify({ type: 'image:generation-done' }),
          } as MessageEvent<string>);
        }
      );

    const { result } = renderHook(
      () => useImageGenerationListener(fakeUserId),
      {
        wrapper: ({ children }) => (
          <EventsContext.Provider
            value={
              {
                listenForPromptGenerationEvent:
                  listenForPromptGenerationEventMock,
              } as unknown as EventRepository
            }
          >
            <QueryClientProvider client={new QueryClient()}>
              {children}
            </QueryClientProvider>
          </EventsContext.Provider>
        ),
      }
    );

    act(() => result.current.listen('prompt-id'));

    await waitFor(() => expect(result.current.progress).toEqual(40));
  });

  it('returns a listen function that updates progress for storage:save-requested event', async () => {
    const listenForPromptGenerationEventMock = vi
      .fn()
      .mockImplementation(
        (
          _eventId: string,
          _promptId: string,
          onEvent: (evt: MessageEvent<string>) => void
        ) => {
          onEvent({
            data: JSON.stringify({ type: 'storage:save-requested' }),
          } as MessageEvent<string>);
        }
      );

    const { result } = renderHook(
      () => useImageGenerationListener(fakeUserId),
      {
        wrapper: ({ children }) => (
          <EventsContext.Provider
            value={
              {
                listenForPromptGenerationEvent:
                  listenForPromptGenerationEventMock,
              } as unknown as EventRepository
            }
          >
            <QueryClientProvider client={new QueryClient()}>
              {children}
            </QueryClientProvider>
          </EventsContext.Provider>
        ),
      }
    );

    act(() => result.current.listen('prompt-id'));

    await waitFor(() => expect(result.current.progress).toEqual(60));
  });

  it('returns a listen function that updates progress for storage:save-done event', async () => {
    const listenForPromptGenerationEventMock = vi
      .fn()
      .mockImplementation(
        (
          _eventId: string,
          _promptId: string,
          onEvent: (evt: MessageEvent<string>) => void
        ) => {
          onEvent({
            data: JSON.stringify({ type: 'storage:save-done' }),
          } as MessageEvent<string>);
        }
      );

    const { result } = renderHook(
      () => useImageGenerationListener(fakeUserId),
      {
        wrapper: ({ children }) => (
          <EventsContext.Provider
            value={
              {
                listenForPromptGenerationEvent:
                  listenForPromptGenerationEventMock,
              } as unknown as EventRepository
            }
          >
            <QueryClientProvider client={new QueryClient()}>
              {children}
            </QueryClientProvider>
          </EventsContext.Provider>
        ),
      }
    );

    act(() => result.current.listen('prompt-id'));

    await waitFor(() => expect(result.current.progress).toEqual(80));
  });

  it('returns a listen function that updates progress for done event', async () => {
    const listenForPromptGenerationEventMock = vi
      .fn()
      .mockImplementation(
        (
          _eventId: string,
          _promptId: string,
          onEvent: (evt: MessageEvent<string>) => void
        ) => {
          onEvent({
            data: JSON.stringify({ type: 'done' }),
          } as MessageEvent<string>);
        }
      );

    const queryClient = new QueryClient();

    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(
      () => useImageGenerationListener(fakeUserId),
      {
        wrapper: ({ children }) => (
          <EventsContext.Provider
            value={
              {
                listenForPromptGenerationEvent:
                  listenForPromptGenerationEventMock,
              } as unknown as EventRepository
            }
          >
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </EventsContext.Provider>
        ),
      }
    );

    act(() => result.current.listen('prompt-id'));

    await waitFor(() => expect(result.current.progress).toEqual(100));
    await waitFor(
      () =>
        expect(invalidateQueriesSpy).toHaveBeenCalledWith({
          queryKey: ['events', undefined, 'users', 'fake-user', 'images'],
        }),
      { timeout: 2000 }
    );
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: [
          'users',
          'fake-user',
          'events',
          undefined,
          'remaining-prompts',
        ],
      })
    );
    await waitFor(() => expect(result.current.progress).toEqual(0));
    expect(toast.success).toHaveBeenCalled();
  });

  it('returns a listen function that updates progress for error event', async () => {
    const listenForPromptGenerationEventMock = vi
      .fn()
      .mockImplementation(
        (
          _eventId: string,
          _promptId: string,
          onEvent: (evt: MessageEvent<string>) => void
        ) => {
          onEvent({
            data: JSON.stringify({ type: 'error' }),
          } as MessageEvent<string>);
        }
      );

    const queryClient = new QueryClient();

    const { result } = renderHook(
      () => useImageGenerationListener(fakeUserId),
      {
        wrapper: ({ children }) => (
          <EventsContext.Provider
            value={
              {
                listenForPromptGenerationEvent:
                  listenForPromptGenerationEventMock,
              } as unknown as EventRepository
            }
          >
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </EventsContext.Provider>
        ),
      }
    );

    act(() => result.current.listen('prompt-id'));

    await waitFor(() => expect(result.current.progress).toEqual(0));
    expect(toast.error).toHaveBeenCalled();
  });
});
