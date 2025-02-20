import { CreateSfeirEventDto, SfeirEventBuilder } from './types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SfeirEventService {
  async getSfeirEvents(): Promise<ReturnType<SfeirEventBuilder['build']>[]> {
    return [
      new SfeirEventBuilder()
        .withId('123')
        .withName('Toto')
        .withStartDate(new Date())
        .withEndDate(new Date())
        .build(),
    ];
  }

  async getSfeirEvent(
    id: string
  ): Promise<ReturnType<SfeirEventBuilder['build']>> {
    return new SfeirEventBuilder()
      .withName('Sfeir')
      .withId(id)
      .withStartDate(new Date())
      .withEndDate(new Date())
      .build();
  }

  async createSfeirEvent({
    name,
    startDate,
    endDate,
  }: CreateSfeirEventDto): Promise<ReturnType<SfeirEventBuilder['build']>> {
    return new SfeirEventBuilder()
      .withName(name)
      .withStartDate(new Date(startDate))
      .withEndDate(new Date(endDate))
      .build();
  }

  async deleteSfeirEvent(
    id: string
  ): Promise<ReturnType<SfeirEventBuilder['build']>> {
    return new SfeirEventBuilder()
      .withId(id)
      .withName('FooBar')
      .withStartDate(new Date())
      .withEndDate(new Date())
      .build();
  }
}
