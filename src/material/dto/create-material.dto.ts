import { ApiProperty } from "@nestjs/swagger";

export class CreateMaterialDto {
    @ApiProperty()
        username: string;
    
    @ApiProperty()
        title: string;

    @ApiProperty()
        content: string;

    @ApiProperty({
        type: [String],
    })
        expertise: string[];
}
