import { nanoid } from 'nanoid';

export class SfeirEvent {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;

  private constructor(
    id: string,
    name: string,
    startDate: Date,
    endDate: Date
  ) {
    if (!name) throw new Error('Name is required');
    if (!startDate) throw new Error('Start date is required');
    if (!endDate) throw new Error('End date is required');

    if (startDate.getTime() > endDate.getTime()) {
      throw new Error('Start date must be before end date');
    }

    this.id = id;
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  static from(id: string, name: string, startDate: Date, endDate: Date) {
    return new SfeirEvent(id, name, startDate, endDate);
  }

  static create(name: string, startDate: Date, endDate: Date) {
    return new SfeirEvent(nanoid(8), name, startDate, endDate);
  }

  isActive() {
    const now = Date.now();
    return this.startDate.getTime() <= now && this.endDate.getTime() >= now;
  }
}
