import { render, screen } from '@testing-library/react';
import { EventSelectionPage } from '@/src/pages/event-selection.page';
import { userEvent } from '@testing-library/user-event';
import i18n from '@/src/config/i18n';
import { useNavigate } from 'react-router';
import { Mock } from 'vitest';

vi.mock('react-router', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: vi.fn(),
}));

describe('EventSelectionPage', () => {
  it('prevents submission without an event id', () => {
    render(<EventSelectionPage />);

    expect(screen.getByText('Go')).toBeDisabled();
  });

  it('allows submitting with an event id by clicking a button and triggers navigation to event page', async () => {
    const navigateMock = vi.fn();
    (useNavigate as Mock).mockReturnValue(navigateMock);

    render(<EventSelectionPage />);

    const fakeIdentifier = 'identifier';

    await userEvent.type(
      screen.getByPlaceholderText(i18n.t('event-identifier')),
      fakeIdentifier
    );

    expect(screen.getByText('Go')).not.toBeDisabled();

    await userEvent.click(screen.getByText('Go'));

    expect(navigateMock).toHaveBeenCalledWith(`/events/${fakeIdentifier}`);
  });

  it('allows submitting with an event id by using Enter key and triggers navigation to event page', async () => {
    const navigateMock = vi.fn();
    (useNavigate as Mock).mockReturnValue(navigateMock);

    render(<EventSelectionPage />);

    const fakeIdentifier = 'identifier';

    await userEvent.type(
      screen.getByPlaceholderText(i18n.t('event-identifier')),
      `${fakeIdentifier}[Enter]`
    );

    expect(navigateMock).toHaveBeenCalledWith(`/events/${fakeIdentifier}`);
  });
});
