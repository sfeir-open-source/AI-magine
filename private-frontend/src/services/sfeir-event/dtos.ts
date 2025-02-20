export type SfeirEventDto = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
};

export type CreateSfeirEventDto = {
  name: string;
  startDateTs: number;
  endDateTs: number;
};
