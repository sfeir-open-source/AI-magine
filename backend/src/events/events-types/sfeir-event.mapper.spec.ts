import { SfeirEvent } from '@/events/events-types';
import { SfeirEventMappers } from '@/events/events-types/sfeir-event.mappers';
import { expect } from 'vitest';

const startDate = new Date(2024, 10, 3, 0, 0, 0);
const endDate = new Date(2024, 10, 5, 0, 0, 0);
const id = '1';
const name = 'Event 1';

const dtoObject = {
  id,
  name,
  startDate: startDate.toISOString(),
  endDate: endDate.toISOString(),
  isActive: false,
};
const domainObject = SfeirEvent.from(id, name, startDate, endDate);

describe('SfeirEventMappers - fromDomainToDto', () => {
  it('should transform domain object to dto', () => {
    expect(SfeirEventMappers.fromDomainToDTO(domainObject)).toEqual(dtoObject);
  });

  it('should transform dto to domain object', () => {
    expect(SfeirEventMappers.fromDTOToDomain(dtoObject)).toEqual(domainObject);
  });

  it('should transform Timestamp string to Date', () => {
    expect(() =>
      SfeirEventMappers.fromTimestampStringToDate(undefined)
    ).toThrow();
    expect(() => SfeirEventMappers.fromTimestampStringToDate('')).toThrow();
  });
});
