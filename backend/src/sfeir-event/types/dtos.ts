import {ApiProperty} from "@nestjs/swagger";

export class SfeirEventDto {
    private constructor() {}

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
    startDate: Date;

    @ApiProperty({
        name: 'endDate',
        description: 'End date of the event',
    })
    endDate: Date;
}

export class CreateSfeirEventDto {
    private constructor() {}

    @ApiProperty({
        name: 'name',
        description: 'Name of the event',
    })
    name: string;

    @ApiProperty({
        name: 'startDate',
        description: 'Start date of the event',
    })
    startDate: Date;

    @ApiProperty({
        name: 'endDate',
        description: 'End date of the event',
    })
    endDate: Date;
}
