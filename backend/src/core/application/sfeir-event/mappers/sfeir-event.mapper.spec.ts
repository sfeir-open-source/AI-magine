import { SfeirEventMappers } from '@/core/application/sfeir-event/mappers/sfeir-event.mappers';
import { SfeirEvent } from '@/core/domain/sfeir-event/sfeir-event';

const startDate = new Date(2024, 10, 3, 0, 0, 0);
const endDate = new Date(2024, 10, 5, 0, 0, 0);
const id = '1';
const name = 'Event 1';

const dtoObject = {
  id,
  name,
  allowedPrompts: 2,
  startDate: startDate.toISOString(),
  endDate: endDate.toISOString(),
  isActive: false,
};
const domainObject = SfeirEvent.from(id, name, 2, startDate, endDate);

vi.mock('nanoid', () => ({
  nanoid: () => 'mocked-id',
}));

describe('SfeirEventMappers - fromDomainToDto', () => {
  it('should transform domain object to dto', () => {
    expect(SfeirEventMappers.fromDomainToDTO(domainObject)).toEqual(dtoObject);
  });

  it('should transform dto to domain object', () => {
    expect(SfeirEventMappers.fromDTOToDomain(dtoObject)).toEqual(domainObject);
    expect(
      SfeirEventMappers.fromDTOToDomain({
        ...dtoObject,
        id: undefined,
      })
    ).toEqual({ ...domainObject, id: 'mocked-id', allowedPrompts: 5 });
  });

  it('should transform Timestamp string to Date', () => {
    expect(() =>
      SfeirEventMappers.fromTimestampStringToDate(undefined)
    ).toThrow();
    expect(() => SfeirEventMappers.fromTimestampStringToDate('')).toThrow();
  });
});
