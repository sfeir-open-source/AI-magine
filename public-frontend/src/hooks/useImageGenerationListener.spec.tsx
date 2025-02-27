import { useNavigate, useParams } from 'react-router';
import { expect, Mock } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useImageGenerationListener } from '@/src/hooks/useImageGenerationListener';
import i18n from '@/src/config/i18n';
import { toast } from 'sonner';
import { useUserId } from '@/src/hooks/useUserId';

vi.mock('react-router');
vi.mock('@/src/providers/events/useEventsProvider', () => ({
  useEventsProvider: () => ({
    listenForPromptGenerationEvent: (_eventId: string, _promptId: string, onEvent: (evt: any) => void) => {
      onEvent({ data: JSON.stringify({ type: 'done' }) });
    },
  }),
}));
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn().mockImplementation((_text, options: { onAutoClose: () => void }) => {
      options.onAutoClose();
    }),
  },
}));
vi.mock('@/src/hooks/useUserId');

describe('useImageGenerationListener', () => {
  it('throws an error if eventId is empty', () => {
    (useParams as Mock).mockReturnValue({ promptId: 'prompt-id', eventId: undefined });

    expect(() => renderHook(() => useImageGenerationListener())).toThrow();
  });

  it('throws an error if promptId is empty', () => {
    (useParams as Mock).mockReturnValue({ promptId: undefined, eventId: 'event-id' });

    expect(() => renderHook(() => useImageGenerationListener())).toThrow();
  });

  it('displays an error message if userId is empty and redirects to event form page', async () => {
    (useParams as Mock).mockReturnValue({ promptId: 'prompt-id', eventId: 'event-id' });

    const navigateMock = vi.fn();
    (useNavigate as Mock).mockReturnValue(navigateMock);

    renderHook(() => useImageGenerationListener());

    expect(toast.error).toHaveBeenCalledWith((i18n.t('failed-authenticate-redirect')), expect.any(Object));
    expect(navigateMock).toHaveBeenCalledWith(`/events/event-id`);
  });

  it('waits for events until "done" event and then redirects to images page', () => {
    (useParams as Mock).mockReturnValue({ promptId: 'prompt-id', eventId: 'event-id' });

    (useUserId as Mock).mockReturnValue('user-id');

    const navigateMock = vi.fn();
    (useNavigate as Mock).mockReturnValue(navigateMock);

    renderHook(() => useImageGenerationListener());

    expect(navigateMock).toHaveBeenCalledWith(`/events/event-id/users/user-id/images`);
  });
});
