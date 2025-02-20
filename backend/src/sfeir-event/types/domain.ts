import * as assert from 'node:assert';

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

  static from(id: string, name: string, startDate: Date, endDate: Date) {
    return new SfeirEvent(id, name, startDate, endDate);
  }

  static create(name: string, startDate: Date, endDate: Date) {
    return new SfeirEvent(crypto.randomUUID(), name, startDate, endDate);
  }
}

export class SfeirEventBuilder {
  private _id: string | undefined;
  private _name: string | undefined;
  private _startDate: Date | undefined;
  private _endDate: Date | undefined;

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
    assert(this._name, 'Name is required');
    assert(this._startDate, 'Start date is required');
    assert(this._endDate, 'End date is required');
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
