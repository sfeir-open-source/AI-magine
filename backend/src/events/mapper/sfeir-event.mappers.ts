import { GetSfeirEventDto } from '@/events/dto/get-sfeir-event.dtos';
import { SfeirEvent } from '@/events/domain';

export class SfeirEventMappers {
  static fromDomainToDTO(actual: SfeirEvent): GetSfeirEventDto {
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

  static fromTimestampStringToDate(timestampString: string | undefined) {
    if (!timestampString) {
      throw new Error('Timestamp string is undefined');
    }
    const timestamp = parseInt(timestampString);
    return new Date(timestamp);
  }
}
