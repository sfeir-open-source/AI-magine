import { SfeirEventBuilder } from '@/events/events-types/sfeir-event.domain';
import { SfeirEventMappers } from '@/events/events-types/sfeir-event.mappers';

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
const domainObject = SfeirEventBuilder.create()
  .withId(id)
  .withName(name)
  .withStartDate(startDate)
  .withEndDate(endDate)
  .build();

describe('SfeirEventMappers - fromDomainToDto', () => {
  it('should transform domain object to dto', () => {
    expect(SfeirEventMappers.fromDomainToDTO(domainObject)).toEqual(dtoObject);
  });

  it('should transform dto to domain object', () => {
    expect(SfeirEventMappers.fromDTOToDomain(dtoObject)).toEqual(domainObject);
  });
});
