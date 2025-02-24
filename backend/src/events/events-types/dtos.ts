import {ApiProperty} from "@nestjs/swagger";

export class SfeirEventDto {
    @ApiProperty({
        name: 'id',
        description: 'Unique identifier of the event',
    })
    id: string;

    @ApiProperty({
        name: 'name',
        description: 'Name of the event',
    })
    name: string;

    @ApiProperty({
        name: 'startDate',
        description: 'Start date of the event',
    })
    startDate: string;

    @ApiProperty({
        name: 'endDate',
        description: 'End date of the event',
    })
    endDate: string;

    @ApiProperty({
        name: 'isActive',
        description: 'Is the event active',
    })
    isActive: boolean;
}

export class CreateSfeirEventDto {
    private constructor() {}

    @ApiProperty({
        name: 'name',
        description: 'Name of the event',
    })
    name: string;

    @ApiProperty({
        name: 'startDateTs',
        description: 'Start date timestamp of the event',
    })
    startDateTs: string;

    @ApiProperty({
        name: 'endDateTs',
        description: 'End date timestamp of the event',
    })
    endDateTs: string;
}
