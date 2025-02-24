import { nanoid } from 'nanoid';

class SfeirEvent {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly startDate: Date,
    private readonly endDate: Date
  ) {}

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      startDate: this.startDate,
      endDate: this.endDate,
    };
  }

  match(id: string) {
    return this.id === id;
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

export class SfeirEventBuilder {
  private _id: string | undefined;
  private _name: string | undefined;
  private _startDate: Date | undefined;
  private _endDate: Date | undefined;

  private constructor() {}

  static create() {
    return new SfeirEventBuilder();
  }

  withId(id: string) {
    this._id = id;
    return this;
  }

  withName(name: string) {
    this._name = name;
    return this;
  }

  withStartDate(startDate: Date) {
    this._startDate = startDate;
    return this;
  }

  withEndDate(endDate: Date) {
    this._endDate = endDate;
    return this;
  }

  build() {
    if (!this._name) throw new Error('Name is required');
    if (!this._startDate) throw new Error('Start date is required');
    if (!this._endDate) throw new Error('End date is required');

    if (this._startDate.getTime() > this._endDate.getTime()) {
      throw new Error('Start date must be before end date');
    }

    if (!this._id) {
      return SfeirEvent.create(this._name, this._startDate, this._endDate);
    }
    return SfeirEvent.from(
      this._id,
      this._name,
      this._startDate,
      this._endDate
    );
  }
}
