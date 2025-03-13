import { render, screen } from '@testing-library/react';
import { PromptEditor } from '@/src/components/prompt-editor/prompt-editor';
import i18n from '@/src/config/i18n';
import { useImageGenerationListener } from '@/src/hooks/useImageGenerationListener';
import { useCreateEventPromptMutation } from '@/src/hooks/useCreateEventPromptMutation';
import { userEvent } from '@testing-library/user-event';
import { Mock } from 'vitest';
import { useParams } from 'react-router';
import { useUserId } from '@/src/hooks/useUserId';

vi.mock('@/src/hooks/useCreateEventPromptMutation');
vi.mock('@/src/hooks/useImageGenerationListener');
vi.mock('react-router');
vi.mock('@/src/hooks/useUserId');

describe('PromptEditor', () => {
  it('displays an edit message if a prompt is given', () => {
    (useParams as Mock).mockReturnValue({});
    (useImageGenerationListener as Mock).mockReturnValue({});
    (useCreateEventPromptMutation as Mock).mockReturnValue({});

    const fakeExistingPrompt = 'this is a test prompt';

    render(<PromptEditor displayedImagePrompt={fakeExistingPrompt} />);

    expect(screen.getByText(i18n.t('edit-prompt'))).toBeInTheDocument();
    expect(screen.getByDisplayValue(fakeExistingPrompt)).toBeInTheDocument();
  });

  it('displays a "write" message if no prompt was given', () => {
    (useParams as Mock).mockReturnValue({});
    (useImageGenerationListener as Mock).mockReturnValue({});
    (useCreateEventPromptMutation as Mock).mockReturnValue({});

    render(<PromptEditor displayedImagePrompt="" />);

    expect(screen.getByText(i18n.t('write-prompt'))).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(i18n.t('enter-prompt-placeholder'))
    ).toHaveValue('');
  });

  it('calls a method to generate a prompt when clicking on the submit button', async () => {
    const fakeUserId = 'test-user-id';
    (useUserId as Mock).mockReturnValue(fakeUserId);
    const fakeEventId = 'test-event-id';
    (useParams as Mock).mockReturnValue({ eventId: fakeEventId });

    const listenMock = vi.fn();
    (useImageGenerationListener as Mock).mockReturnValue({
      listen: listenMock,
    });

    const fakePromptId = 'fake-prompt-id';
    const mutateAsyncMock = vi
      .fn()
      .mockResolvedValue({ promptId: fakePromptId });
    (useCreateEventPromptMutation as Mock).mockReturnValue({
      mutateAsync: mutateAsyncMock,
    });

    render(<PromptEditor displayedImagePrompt="" />);

    const fakePrompt = 'This is a test prompt';
    await userEvent.type(
      screen.getByPlaceholderText(i18n.t('enter-prompt-placeholder')),
      fakePrompt
    );
    await userEvent.click(screen.getByText(i18n.t('generate-new-image')));

    expect(mutateAsyncMock).toHaveBeenCalledWith({
      eventId: fakeEventId,
      userId: fakeUserId,
      prompt: fakePrompt,
    });

    expect(listenMock).toHaveBeenCalledWith(fakePromptId);
  });

  it('displays a loading message when prompt is loading', async () => {
    (useParams as Mock).mockReturnValue({});

    (useImageGenerationListener as Mock).mockReturnValue({
      listen: vi.fn(),
      progress: 50,
    });

    (useCreateEventPromptMutation as Mock).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    render(<PromptEditor displayedImagePrompt="" />);

    const buttonText = new RegExp(i18n.t('generating-your-image'));

    expect(screen.getByText(buttonText)).toBeInTheDocument();
    expect(screen.getByText(buttonText)).toBeDisabled();
  });
});
