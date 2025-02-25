export type EventDto = {
  id: string;
  name: string;
  startDate: number;
  endDate: number;
  isActive: boolean;
};

export type CreateEventDto = {
  name: string;
  startDateTs: number;
  endDateTs: number;
};
