import {
  pastEventsSelector,
  todayEventsSelector,
  upcomingEventsSelector,
  useEventList,
} from '@/src/hooks/useEventList';
import { expect, Mock } from 'vitest';
import { Event } from '@/src/domain/Event';
import { EventListPage } from '@/src/pages/event-list.page';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { userEvent } from '@testing-library/user-event';
import i18n from '@/src/config/i18n';

vi.mock('@/src/hooks/useEventList');

describe('EventListPage', () => {
  it('displays today, upcoming and past events', async () => {
    (todayEventsSelector as Mock).mockReturnValue([
      new Event(
        '1',
        'today event',
        new Date().toISOString(),
        new Date().toISOString()
      ),
    ]);
    (upcomingEventsSelector as Mock).mockReturnValue([
      new Event(
        '1',
        'upcoming event',
        new Date().toISOString(),
        new Date().toISOString()
      ),
    ]);
    (pastEventsSelector as Mock).mockReturnValue([
      new Event(
        '1',
        'past event',
        new Date().toISOString(),
        new Date().toISOString()
      ),
    ]);
    (useEventList as Mock).mockImplementation((selector: () => unknown[]) => ({
      data: selector(),
    }));

    render(
      <MemoryRouter>
        <EventListPage />
      </MemoryRouter>
    );

    expect(screen.getByText('today event')).toBeInTheDocument();
    expect(screen.getByText('upcoming event')).toBeInTheDocument();

    await userEvent.click(screen.getByText(i18n.t('past-events')));

    expect(screen.getByText('past event')).toBeInTheDocument();
  });
});
