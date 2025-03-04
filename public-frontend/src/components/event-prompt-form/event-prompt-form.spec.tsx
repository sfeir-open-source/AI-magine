import { Mock } from 'vitest';
import {
  EventPromptForm,
  STORAGE_ALLOW_CONTACT_KEY,
  STORAGE_EMAIL_KEY,
  STORAGE_NICKNAME_KEY,
  STORAGE_PROMPT_KEY,
} from '@/src/components/event-prompt-form/event-prompt-form';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useNavigate } from 'react-router';
import i18n from 'i18next';
import { useEventPromptMutation } from '@/src/hooks/useEventPromptMutation';
import { useFingerprint } from '@/src/hooks/useFingerprint';
import { Toaster } from '@/components/ui/sonner';
import { STORAGE_USER_ID_KEY } from '@/src/hooks/useUserId';

vi.mock('react-router', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: vi.fn(),
}));

vi.mock('@/src/hooks/useFingerprint');

vi.mock('@/src/hooks/useEventPromptMutation');

describe('EventPromptForm', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('displays title and end date of the event', () => {
    (useNavigate as Mock).mockReturnValue(vi.fn());
    (useEventPromptMutation as Mock).mockReturnValue({ mutateAsync: vi.fn() });

    render(
      <EventPromptForm
        event={{
          id: 'event-id',
          name: 'DevLille',
          endDate: new Date(2025, 24, 2).toISOString(),
          startDate: new Date().toISOString(),
        }}
      />
    );

    expect(screen.getByText('DevLille')).toBeInTheDocument();
    expect(screen.getByText(/02\/01\/2027 00:00/)).toBeInTheDocument();
  });

  it('prevents submission if form is invalid', async () => {
    const navigateMock = vi.fn();
    (useNavigate as Mock).mockReturnValue(navigateMock);

    (useEventPromptMutation as Mock).mockReturnValue({ mutateAsync: vi.fn() });

    render(
      <EventPromptForm
        event={{
          id: 'event-id',
          name: 'DevLille',
          endDate: new Date(2025, 24, 2).toISOString(),
          startDate: new Date().toISOString(),
        }}
      />
    );

    await userEvent.click(screen.getByText(i18n.t('generate-image')));

    expect(navigateMock).not.toHaveBeenCalled();
    expect(
      screen.getByText(i18n.t('empty-nickname-error'))
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('invalid-email-error'))).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('empty-allow-contact-error'))
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('empty-prompt-error'))).toBeInTheDocument();
  });

  it('submits form if filled correctly', async () => {
    const navigateMock = vi.fn();
    (useNavigate as Mock).mockReturnValue(navigateMock);

    const fakePromptId = 'fake-prompt-id';
    const fakeUserId = 'fake-user';
    const mutateAsyncMock = vi
      .fn()
      .mockReturnValue({ promptId: fakePromptId, userId: fakeUserId });
    (useEventPromptMutation as Mock).mockReturnValue({
      mutateAsync: mutateAsyncMock,
    });

    const fakeFingerprint = 'fake-fingerprint';
    (useFingerprint as Mock).mockReturnValue(fakeFingerprint);

    const fakeEventId = 'event-id';

    const fakePromptRequest = {
      browserFingerprint: fakeFingerprint,
      eventId: fakeEventId,
      userNickname: 'test-name',
      userEmail: 'test-email@test.com',
      allowContact: false,
      prompt: 'test-prompt',
    };

    render(
      <EventPromptForm
        event={{
          id: fakeEventId,
          name: 'DevLille',
          endDate: new Date(2025, 24, 2).toISOString(),
          startDate: new Date().toISOString(),
        }}
      />
    );

    await userEvent.type(
      screen.getByLabelText(i18n.t('nickname')),
      fakePromptRequest.userNickname
    );
    await userEvent.type(
      screen.getByLabelText(i18n.t('email-address')),
      fakePromptRequest.userEmail
    );
    await userEvent.click(screen.getByLabelText(i18n.t('no')));
    await userEvent.type(
      screen.getByLabelText(i18n.t('prompt')),
      fakePromptRequest.prompt
    );
    await userEvent.click(screen.getByText(i18n.t('generate-image')));

    expect(mutateAsyncMock).toHaveBeenCalledWith(fakePromptRequest);
    expect(navigateMock).toHaveBeenCalledWith(
      `/events/event-id/prompts/${fakePromptId}/loading`
    );
    expect(localStorage.getItem(STORAGE_NICKNAME_KEY)).toEqual(
      fakePromptRequest.userNickname
    );
    expect(localStorage.getItem(STORAGE_EMAIL_KEY)).toEqual(
      fakePromptRequest.userEmail
    );
    expect(localStorage.getItem(STORAGE_ALLOW_CONTACT_KEY)).toEqual('false');
    expect(localStorage.getItem(STORAGE_PROMPT_KEY)).toEqual(
      fakePromptRequest.prompt
    );
    expect(localStorage.getItem(STORAGE_USER_ID_KEY)).toEqual(fakeUserId);
  });

  it('displays an error if call to create prompt failed', async () => {
    const navigateMock = vi.fn();
    (useNavigate as Mock).mockReturnValue(navigateMock);

    const mutateAsyncMock = vi
      .fn()
      .mockRejectedValue(new Error('Unknown error'));
    (useEventPromptMutation as Mock).mockReturnValue({
      mutateAsync: mutateAsyncMock,
    });

    const fakeFingerprint = 'fake-fingerprint';
    (useFingerprint as Mock).mockReturnValue(fakeFingerprint);

    const fakeEventId = 'event-id';

    const fakePromptRequest = {
      browserFingerprint: fakeFingerprint,
      eventId: fakeEventId,
      userNickname: 'test-name',
      userEmail: 'test-email@test.com',
      allowContact: false,
      prompt: 'test-prompt',
    };

    render(
      <>
        <EventPromptForm
          event={{
            id: fakeEventId,
            name: 'DevLille',
            endDate: new Date(2025, 24, 2).toISOString(),
            startDate: new Date().toISOString(),
          }}
        />
        <Toaster />
      </>
    );

    await userEvent.type(
      screen.getByLabelText(i18n.t('nickname')),
      fakePromptRequest.userNickname
    );
    await userEvent.type(
      screen.getByLabelText(i18n.t('email-address')),
      fakePromptRequest.userEmail
    );
    await userEvent.click(screen.getByLabelText(i18n.t('no')));
    await userEvent.type(
      screen.getByLabelText(i18n.t('prompt')),
      fakePromptRequest.prompt
    );
    await userEvent.click(screen.getByText(i18n.t('generate-image')));

    expect(mutateAsyncMock).toHaveBeenCalledWith(fakePromptRequest);
    expect(navigateMock).not.toHaveBeenCalled();
    expect(
      screen.getByText(`${i18n.t('failed-create-prompt')}: Unknown error`)
    ).toBeInTheDocument();
  });

  it('displays a spinner if call result is pending', async () => {
    (useNavigate as Mock).mockReturnValue(vi.fn());

    (useEventPromptMutation as Mock).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
    });

    (useFingerprint as Mock).mockReturnValue('');

    render(
      <EventPromptForm
        event={{
          id: 'event-id',
          name: 'DevLille',
          endDate: new Date(2025, 24, 2).toISOString(),
          startDate: new Date().toISOString(),
        }}
      />
    );

    expect(screen.queryByText('Go')).not.toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('prevents submission if maximum tries reached', async () => {
    // TODO
  });
});
