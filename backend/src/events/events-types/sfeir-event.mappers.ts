import { SfeirEventDto } from '@/events/events-types/sfeir-event.dtos';
import { SfeirEvent } from '@/events/events-types';

export class SfeirEventMappers {
  static fromDomainToDTO(actual: SfeirEvent): SfeirEventDto {
    return {
      id: actual.id,
      name: actual.name,
      startDate: actual.startDate.toISOString(),
      endDate: actual.endDate.toISOString(),
      isActive: actual.isActive(),
    };
  }

  static fromDTOToDomain({
    id,
    name,
    startDate,
    endDate,
  }: {
    id: string | undefined;
    name: string;
    startDate: string | number;
    endDate: string | number;
    isActive: boolean;
  }): SfeirEvent {
    if (id) {
      return SfeirEvent.from(id, name, new Date(startDate), new Date(endDate));
    }
    return SfeirEvent.create(name, new Date(startDate), new Date(endDate));
  }
}
