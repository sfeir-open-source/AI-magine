import { describe, it, expect } from 'vitest';
import { SfeirEventBuilder } from '@/events/events-types/sfeir-event.domain';

const eventName = 'foobar';
const startDate = new Date('2024-12-12T12:00:00.000Z');
const endDate = new Date('2024-12-13T12:00:00.000Z');

const builderWithoutName = SfeirEventBuilder.create()
  .withStartDate(startDate)
  .withEndDate(endDate);
const builderWithoutStartDate = SfeirEventBuilder.create()
  .withName(eventName)
  .withEndDate(endDate);
const builderWithoutEndDate = SfeirEventBuilder.create()
  .withName(eventName)
  .withStartDate(startDate);
const builderWithInvertedDates = SfeirEventBuilder.create()
  .withName(eventName)
  .withStartDate(endDate)
  .withEndDate(startDate);
const builder = SfeirEventBuilder.create()
  .withName(eventName)
  .withStartDate(startDate)
  .withEndDate(endDate);

describe('SfeirEvent', () => {
  it('should have an id, a name and date boundaries', () => {
    expect(() => builderWithoutName.build()).toThrow();
    expect(() => builderWithoutStartDate.build()).toThrow();
    expect(() => builderWithoutEndDate.build()).toThrow();

    const event = builder.build().toJSON();
    expect(event).toHaveProperty('id');
    expect(event).toHaveProperty('name', eventName);
    expect(event).toHaveProperty('startDate', startDate);
    expect(event).toHaveProperty('endDate', endDate);
  });

  it('should have valid dates boundaries', () => {
    expect(() => builderWithInvertedDates.build()).toThrow();
  })
});
