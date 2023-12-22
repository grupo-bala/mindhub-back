import { ApiProperty } from "@nestjs/swagger";

export class CreateEventDto {    
    @ApiProperty()
        title: string;

    @ApiProperty()
        content: string;
    
    @ApiProperty()
        longitude: number;
    
    @ApiProperty()
        latitude: number;
    
    @ApiProperty()
        date: string;

    @ApiProperty()
        postDate: string;
    
    @ApiProperty()
        localName: string;
}
