import { SfeirEventDto } from '@/events/events-types/dtos';
import { SfeirEventBuilder } from '@/events/events-types/sfeir-event.domain';

export class SfeirEventMappers {
  static fromDomainToDTO(
    actual: ReturnType<SfeirEventBuilder['build']>
  ): SfeirEventDto {
    const object = actual.toJSON();
    return {
      id: object.id,
      name: object.name,
      startDate: object.startDate.toISOString(),
      endDate: object.endDate.toISOString(),
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
  }): ReturnType<SfeirEventBuilder['build']> {
    const builder = SfeirEventBuilder.create()
      .withName(name)
      .withStartDate(new Date(startDate))
      .withEndDate(new Date(endDate));
    if (id) {
      builder.withId(id);
    }
    return builder.build();
  }
}
