import { createContext } from 'react';
import { EventRepository } from '@/src/domain/EventRepository';

export const EventsContext = createContext<EventRepository | null>(null)