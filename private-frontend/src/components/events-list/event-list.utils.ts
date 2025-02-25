import {Event} from "@/src/services/event";

export const sortEvents = (events: Event[]): Event[] => {
    const now = new Date();

    const isFutureEvent = (event: Event): boolean => {
        return event.startDate > now;
    };

    const isPastEvent = (event: Event): boolean => {
        return event.endDate < now;
    };

    const activeEvents = events.filter((e) => e.isActive && !isPastEvent(e));
    const futurePendingEvents = events.filter(
        (e) => !e.isActive && isFutureEvent(e)
    );
    const pastEvents = events.filter((e) => isPastEvent(e));

    const sortedActiveEvents = activeEvents.sort(
        (a, b) => a.endDate.getTime() - b.endDate.getTime()
    );

    const sortedFutureEvents = futurePendingEvents.sort(
        (a, b) => a.startDate.getTime() - b.startDate.getTime()
    );

    const sortedPastEvents = pastEvents.sort(
        (a, b) => b.endDate.getTime() - a.endDate.getTime()
    );

    return [...sortedActiveEvents, ...sortedFutureEvents, ...sortedPastEvents];
};
