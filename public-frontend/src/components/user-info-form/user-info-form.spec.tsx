import { Mock } from 'vitest';
import { UserInfoForm } from '@/src/components/user-info-form/user-info-form';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useNavigate } from 'react-router';
import i18n from 'i18next';
import { useFingerprint } from '@/src/hooks/useFingerprint';
import { Toaster } from '@/components/ui/sonner';
import { STORAGE_USER_ID_KEY } from '@/src/hooks/useUserId';
import { useCreateUserMutation } from '@/src/hooks/useCreateUserMutation';

vi.mock('react-router', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: vi.fn(),
}));

vi.mock('@/src/hooks/useFingerprint');

vi.mock('@/src/hooks/useCreateUserMutation');

describe('EventPromptForm', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('displays title and end date of the event', () => {
    (useNavigate as Mock).mockReturnValue(vi.fn());
    (useCreateUserMutation as Mock).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    render(
      <UserInfoForm
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

    (useCreateUserMutation as Mock).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    render(
      <UserInfoForm
        event={{
          id: 'event-id',
          name: 'DevLille',
          endDate: new Date(2025, 24, 2).toISOString(),
          startDate: new Date().toISOString(),
        }}
      />
    );

    await userEvent.click(screen.getByText(i18n.t('go-to-image-generation')));

    expect(navigateMock).not.toHaveBeenCalled();
    expect(
      screen.getByText(i18n.t('empty-nickname-error'))
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('invalid-email-error'))).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('empty-allow-contact-error'))
    ).toBeInTheDocument();
  });

  it('submits form if filled correctly', async () => {
    const navigateMock = vi.fn();
    (useNavigate as Mock).mockReturnValue(navigateMock);

    const fakeUserId = 'fake-user';
    const mutateAsyncMock = vi.fn().mockReturnValue({ id: fakeUserId });
    (useCreateUserMutation as Mock).mockReturnValue({
      mutateAsync: mutateAsyncMock,
    });

    const fakeFingerprint = 'fake-fingerprint';
    (useFingerprint as Mock).mockReturnValue(fakeFingerprint);

    const fakeEventId = 'event-id';

    const fakeUserRequest = {
      browserFingerprint: fakeFingerprint,
      userNickname: 'test-name',
      userEmail: 'test-email@test.com',
      allowContact: false,
    };

    render(
      <UserInfoForm
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
      fakeUserRequest.userNickname
    );
    await userEvent.type(
      screen.getByLabelText(i18n.t('email-address')),
      fakeUserRequest.userEmail
    );
    await userEvent.click(screen.getByLabelText(i18n.t('no')));

    await userEvent.click(screen.getByText(i18n.t('go-to-image-generation')));

    expect(mutateAsyncMock).toHaveBeenCalledWith(fakeUserRequest);
    expect(navigateMock).toHaveBeenCalledWith(
      `/events/${fakeEventId}/image-generation`
    );
    expect(sessionStorage.getItem(STORAGE_USER_ID_KEY)).toEqual(fakeUserId);
  });

  it('displays an error if call to create prompt failed', async () => {
    const navigateMock = vi.fn();
    (useNavigate as Mock).mockReturnValue(navigateMock);

    const mutateAsyncMock = vi
      .fn()
      .mockRejectedValue(new Error('Unknown error'));
    (useCreateUserMutation as Mock).mockReturnValue({
      mutateAsync: mutateAsyncMock,
    });

    const fakeFingerprint = 'fake-fingerprint';
    (useFingerprint as Mock).mockReturnValue(fakeFingerprint);

    const fakeEventId = 'event-id';

    const fakeUserRequest = {
      browserFingerprint: fakeFingerprint,
      userNickname: 'test-name',
      userEmail: 'test-email@test.com',
      allowContact: false,
    };

    render(
      <>
        <UserInfoForm
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
      fakeUserRequest.userNickname
    );
    await userEvent.type(
      screen.getByLabelText(i18n.t('email-address')),
      fakeUserRequest.userEmail
    );
    await userEvent.click(screen.getByLabelText(i18n.t('no')));

    await userEvent.click(screen.getByText(i18n.t('go-to-image-generation')));

    expect(mutateAsyncMock).toHaveBeenCalledWith(fakeUserRequest);
    expect(navigateMock).not.toHaveBeenCalled();
    expect(
      screen.getByText('Failed to create user: Unknown error')
    ).toBeInTheDocument();
  });

  it('displays a spinner if call result is pending', async () => {
    (useNavigate as Mock).mockReturnValue(vi.fn());

    (useCreateUserMutation as Mock).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
    });

    (useFingerprint as Mock).mockReturnValue('');

    render(
      <UserInfoForm
        event={{
          id: 'event-id',
          name: 'DevLille',
          endDate: new Date(2025, 24, 2).toISOString(),
          startDate: new Date().toISOString(),
        }}
      />
    );

    expect(screen.queryByText('Go')).not.toBeInTheDocument();
    expect(screen.getByTestId('loader-circle')).toBeInTheDocument();
  });
});
