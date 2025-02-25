import { describe, expect, Mock } from 'vitest';
import {
  EventPromptForm, STORAGE_ALLOW_CONTACT_KEY,
  STORAGE_EMAIL_KEY, STORAGE_JOB_KEY,
  STORAGE_NAME_KEY, STORAGE_PROMPT_KEY,
} from '@/src/components/event-prompt-form/event-prompt-form';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useNavigate } from 'react-router';
import i18n from 'i18next';
import { useEventPromptMutation } from '@/src/hooks/useEventPromptMutation';
import { useFingerprint } from '@/src/hooks/useFingerprint';

vi.mock('react-router', () => ({
  ...vi.importActual('react-router'),
  useNavigate: vi.fn(),
}));

vi.mock('@/src/hooks/useFingerprint');

vi.mock('@/src/hooks/useEventPromptMutation');

describe('EventPromptForm', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('displays title and end date of the event', () => {
    (useNavigate as Mock).mockReturnValue(vi.fn());
    (useEventPromptMutation as Mock).mockReturnValue({mutateAsync: vi.fn()});

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

    (useEventPromptMutation as Mock).mockReturnValue({mutateAsync: vi.fn()});

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

    await userEvent.click(screen.getByText('Go'));

    expect(navigateMock).not.toHaveBeenCalled();
    expect(screen.getByText(i18n.t('empty-name-error'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('invalid-email-error'))).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('empty-job-title-error'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('empty-allow-contact-error'))
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('empty-prompt-error'))).toBeInTheDocument();
  });

  it('submits form if filled correctly', async () => {
    const navigateMock = vi.fn();
    (useNavigate as Mock).mockReturnValue(navigateMock);

    const fakePromptId = 'fake-prompt-id'
    const mutateAsyncMock = vi.fn().mockReturnValue(fakePromptId);
    (useEventPromptMutation as Mock).mockReturnValue({mutateAsync: mutateAsyncMock});

    const fakeFingerprint = 'fake-fingerprint';
    (useFingerprint as Mock).mockReturnValue(fakeFingerprint)

    const fakeEventId = 'event-id'

    const fakePromptRequest = {
      browserFingerprint: fakeFingerprint,
      eventId: fakeEventId,
      userName: 'test-name',
      userEmail: 'test-email@test.com',
      jobTitle: 'test-job',
      allowContact: false,
      prompt: 'test-prompt',
    }

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

    await userEvent.type(screen.getByLabelText(i18n.t('name')), fakePromptRequest.userName);
    await userEvent.type(
      screen.getByLabelText(i18n.t('email-address')),
      fakePromptRequest.userEmail
    );
    await userEvent.type(
      screen.getByLabelText(i18n.t('job-title')),
      fakePromptRequest.jobTitle
    );
    await userEvent.click(screen.getByLabelText(i18n.t('no')));
    await userEvent.type(
      screen.getByLabelText(i18n.t('prompt')),
      fakePromptRequest.prompt
    );
    await userEvent.click(screen.getByText('Go'));

    expect(mutateAsyncMock).toHaveBeenCalledWith(fakePromptRequest)
    expect(navigateMock).toHaveBeenCalledWith(`/events/event-id/prompts/${fakePromptId}/loading`)
    expect(localStorage.getItem(STORAGE_NAME_KEY)).toEqual(fakePromptRequest.userName)
    expect(localStorage.getItem(STORAGE_EMAIL_KEY)).toEqual(fakePromptRequest.userEmail)
    expect(localStorage.getItem(STORAGE_JOB_KEY)).toEqual(fakePromptRequest.jobTitle)
    expect(localStorage.getItem(STORAGE_ALLOW_CONTACT_KEY)).toEqual('false')
    expect(localStorage.getItem(STORAGE_PROMPT_KEY)).toEqual(fakePromptRequest.prompt)
  });

  it('displays a spinner if mutation result is pending', async () => {
    (useNavigate as Mock).mockReturnValue(vi.fn());

    (useEventPromptMutation as Mock).mockReturnValue({mutateAsync: vi.fn(), isPending: true});

    (useFingerprint as Mock).mockReturnValue('')

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

    expect(screen.getByText('Go')).not.toBeInTheDocument()
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  });

  it('prevents submission if maximum tries reached', async () => {
    // TODO
  });
});
