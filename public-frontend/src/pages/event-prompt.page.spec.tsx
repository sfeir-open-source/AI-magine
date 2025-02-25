import { describe, expect, Mock } from 'vitest';
import { useEventById } from '@/src/hooks/useEventById';
import { EventPromptPage } from '@/src/pages/event-prompt.page';
import { render, screen } from '@testing-library/react';
import { Event } from '@/src/domain/Event';
import i18n from '@/src/config/i18n';
import { BrowserRouter } from 'react-router';

vi.mock('@/src/hooks/useEventById');

vi.mock('@/src/components/event-prompt-form/event-prompt-form', () => ({
  EventPromptForm: () => <span>EventPromptForm</span>,
}));

describe('EventPromptPage', () => {
  it('displays a loader if the event is loading', () => {
    (useEventById as Mock).mockReturnValue({ isFetching: true });

    render(<EventPromptPage />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('displays the form when the event is loaded', () => {
    (useEventById as Mock).mockReturnValue({
      data: new Event(
        'id',
        'test event',
        new Date().toISOString(),
        new Date().toISOString()
      ),
      isFetching: false,
    });

    render(<EventPromptPage />);

    expect(screen.getByText('EventPromptForm')).toBeInTheDocument();
  });

  it('displays an error if the event failed to load', () => {
    (useEventById as Mock).mockReturnValue({
      error: new Error('Unknown error'),
      isFetching: false,
    });

    render(
      <BrowserRouter>
        <EventPromptPage />
      </BrowserRouter>
    );

    expect(
      screen.getByText('Error while retrieving event: Unknown error')
    ).toBeInTheDocument();
  });

  it('displays alink to event selection if the event failed to load', () => {
    (useEventById as Mock).mockReturnValue({
      error: new Error('Unknown error'),
      isFetching: false,
    });

    render(
      <BrowserRouter>
        <EventPromptPage />
      </BrowserRouter>
    );

    expect(
      screen.getByText(i18n.t('return-to-event-selection'))
    ).toBeInTheDocument();
  });
});
