import { Event } from '@/src/domain/Event';
import { render, screen } from '@testing-library/react';
import { EventCard } from '@/src/components/event-card/event-card';
import { expect } from 'vitest';
import { MemoryRouter } from 'react-router';

describe('EventCard', () => {
  it('displays information about provided event', () => {
    const startDate = new Date(2025, 2, 20).toISOString();
    const endDate = new Date(2025, 2, 21).toISOString();
    const fakeEvent = new Event(
      'event-identifier',
      'event name',
      startDate,
      endDate
    );

    render(
      <MemoryRouter>
        <EventCard event={fakeEvent} />
      </MemoryRouter>
    );

    expect(screen.getByText(new RegExp(fakeEvent.id))).toBeInTheDocument();
    expect(screen.getByText(fakeEvent.name)).toBeInTheDocument();
    expect(screen.getByText('20/03/2025 00:00:00')).toBeInTheDocument();
    expect(screen.getByText('21/03/2025 00:00:00')).toBeInTheDocument();
  });
});
