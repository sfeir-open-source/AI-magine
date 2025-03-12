import { renderHook } from '@testing-library/react';
import { useEventsProvider } from '@/src/providers/events/useEventsProvider';
import { EventsContext } from '@/src/providers/events/events.context';
import { EventRepository } from '@/src/domain/EventRepository';

describe('useEventsProvider', () => {
  it('returns provided provider', () => {
    const fakeProvider = { getEventById: vi.fn() };

    const { result } = renderHook(() => useEventsProvider(), {
      wrapper: ({ children }) => (
        <EventsContext.Provider
          value={fakeProvider as unknown as EventRepository}
        >
          {children}
        </EventsContext.Provider>
      ),
    });

    expect(result.current).toEqual(fakeProvider);
  });

  it('throws an error if no implementation found', () => {
    expect(() =>
      renderHook(() => useEventsProvider(), {
        wrapper: ({ children }) => (
          <EventsContext.Provider value={null}>
            {children}
          </EventsContext.Provider>
        ),
      })
    ).toThrow();
  });
});
