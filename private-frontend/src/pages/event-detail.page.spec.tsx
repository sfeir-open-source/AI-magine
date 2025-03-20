import { useEventById } from '@/src/hooks/useEventById';
import { expect, Mock } from 'vitest';
import { EventDetailPage } from '@/src/pages/event-detail.page';
import i18n from '@/src/config/i18n';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Event } from '@/src/domain/Event';

vi.mock('@/src/hooks/useEventById');
vi.mock('@/src/components/event-selected-images/event-selected-images');

describe('EventDetailPage', () => {
  it('displays a message if event is loading', () => {
    (useEventById as Mock).mockReturnValue({ isFetching: true });

    render(<EventDetailPage />);

    expect(
      screen.getByText(new RegExp(i18n.t('loading-event-details')))
    ).toBeInTheDocument();
  });

  it('displays a message if event was not found', () => {
    (useEventById as Mock).mockReturnValue({
      isFetching: false,
      data: undefined,
    });

    render(
      <MemoryRouter>
        <EventDetailPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText(i18n.t('event-not-found-description'))
    ).toBeInTheDocument();
  });

  it('displays event details', () => {
    (useEventById as Mock).mockReturnValue({
      isFetching: false,
      data: new Event(
        'event-identifier',
        'event name',
        new Date(2025, 3, 12).toISOString(),
        new Date(2025, 3, 13).toISOString()
      ),
    });

    render(
      <MemoryRouter>
        <EventDetailPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText(new RegExp('event-identifier'))
    ).toBeInTheDocument();
    expect(screen.getByText('event name')).toBeInTheDocument();
    expect(screen.getByText(new RegExp('12/04/2025'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp('13/04/2025'))).toBeInTheDocument();
  });
});
