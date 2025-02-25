import { describe, expect, it } from 'vitest';
import { sortEvents } from '@/src/components/events-list/event-list.utils';
import { Event } from '@/src/services/event';

describe('sortEvents', () => {
  it('should correctly sort active events by endDate in ascending order', () => {
    const now = new Date();
    const events: Event[] = [
      {
        id: '1',
        name: 'Active Event 1',
        startDate: now,
        endDate: new Date(now.getTime() + 20000),
        isActive: true,
      },
      {
        id: '2',
        name: 'Active Event 2',
        startDate: now,
        endDate: new Date(now.getTime() + 10000),
        isActive: true,
      },
    ];

    const result = sortEvents(events);

    expect(result).toEqual([
      {
        id: '2',
        name: 'Active Event 2',
        startDate: now,
        endDate: new Date(now.getTime() + 10000),
        isActive: true,
      },
      {
        id: '1',
        name: 'Active Event 1',
        startDate: now,
        endDate: new Date(now.getTime() + 20000),
        isActive: true,
      },
    ]);
  });

  it('should correctly sort future pending events by startDate in ascending order', () => {
    const now = new Date();
    const events: Event[] = [
      {
        id: '1',
        name: 'Future Event 1',
        startDate: new Date(now.getTime() + 30000),
        endDate: new Date(now.getTime() + 40000),
        isActive: false,
      },
      {
        id: '2',
        name: 'Future Event 2',
        startDate: new Date(now.getTime() + 10000),
        endDate: new Date(now.getTime() + 20000),
        isActive: false,
      },
    ];

    const result = sortEvents(events);

    expect(result).toEqual([
      {
        id: '2',
        name: 'Future Event 2',
        startDate: new Date(now.getTime() + 10000),
        endDate: new Date(now.getTime() + 20000),
        isActive: false,
      },
      {
        id: '1',
        name: 'Future Event 1',
        startDate: new Date(now.getTime() + 30000),
        endDate: new Date(now.getTime() + 40000),
        isActive: false,
      },
    ]);
  });

  it('should correctly sort past events by endDate in descending order', () => {
    const now = new Date();
    const events: Event[] = [
      {
        id: '1',
        name: 'Past Event 1',
        startDate: new Date(now.getTime() - 40000),
        endDate: new Date(now.getTime() - 30000),
        isActive: false,
      },
      {
        id: '2',
        name: 'Past Event 2',
        startDate: new Date(now.getTime() - 20000),
        endDate: new Date(now.getTime() - 10000),
        isActive: false,
      },
    ];

    const result = sortEvents(events);

    expect(result).toEqual([
      {
        id: '2',
        name: 'Past Event 2',
        startDate: new Date(now.getTime() - 20000),
        endDate: new Date(now.getTime() - 10000),
        isActive: false,
      },
      {
        id: '1',
        name: 'Past Event 1',
        startDate: new Date(now.getTime() - 40000),
        endDate: new Date(now.getTime() - 30000),
        isActive: false,
      },
    ]);
  });

  it('should combine active, future pending, and past events in the correct order', () => {
    const now = new Date();
    const events: Event[] = [
      {
        id: '1',
        name: 'Active Event',
        startDate: now,
        endDate: new Date(now.getTime() + 5000),
        isActive: true,
      },
      {
        id: '2',
        name: 'Future Event',
        startDate: new Date(now.getTime() + 10000),
        endDate: new Date(now.getTime() + 20000),
        isActive: false,
      },
      {
        id: '3',
        name: 'Past Event',
        startDate: new Date(now.getTime() - 20000),
        endDate: new Date(now.getTime() - 10000),
        isActive: false,
      },
    ];

    const result = sortEvents(events);

    expect(result).toEqual([
      {
        id: '1',
        name: 'Active Event',
        startDate: now,
        endDate: new Date(now.getTime() + 5000),
        isActive: true,
      },
      {
        id: '2',
        name: 'Future Event',
        startDate: new Date(now.getTime() + 10000),
        endDate: new Date(now.getTime() + 20000),
        isActive: false,
      },
      {
        id: '3',
        name: 'Past Event',
        startDate: new Date(now.getTime() - 20000),
        endDate: new Date(now.getTime() - 10000),
        isActive: false,
      },
    ]);
  });

  it('should return an empty array when there are no events', () => {
    const result = sortEvents([]);
    expect(result).toEqual([]);
  });
});
