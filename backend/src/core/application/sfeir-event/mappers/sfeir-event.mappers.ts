import { GetSfeirEventDto } from '@/core/application/sfeir-event/dto/get-sfeir-event.dtos';
import { SfeirEvent } from '@/core/domain/sfeir-event/sfeir-event';

export class SfeirEventMappers {
  static fromDomainToDTO(actual: SfeirEvent): GetSfeirEventDto {
    return {
      id: actual.id,
      name: actual.name,
      allowedPrompts: actual.allowedPrompts,
      startDate: actual.startDate.toISOString(),
      endDate: actual.endDate.toISOString(),
      isActive: actual.isActive(),
    };
  }

  static fromDTOToDomain({
    id,
    name,
    allowedPrompts,
    startDate,
    endDate,
  }: {
    id: string | undefined;
    name: string;
    allowedPrompts: number;
    startDate: string | number;
    endDate: string | number;
    isActive: boolean;
  }): SfeirEvent {
    if (id) {
      return SfeirEvent.from(
        id,
        name,
        allowedPrompts,
        new Date(startDate),
        new Date(endDate)
      );
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
