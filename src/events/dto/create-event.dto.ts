import { ApiProperty } from "@nestjs/swagger";

export class CreateEventDto {
    @ApiProperty()
        username: string;
    
    @ApiProperty()
        title: string;

    @ApiProperty()
        content: string;
    
    @ApiProperty()
        timestamp: string;
    
    @ApiProperty()
        longitude: number;
    
    @ApiProperty()
        latitude: number;
}
