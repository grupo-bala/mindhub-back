import { ApiProperty } from "@nestjs/swagger";

export class CreateMaterialDto {
    @ApiProperty()
        title: string;

    @ApiProperty()
        content: string;

    @ApiProperty()
        expertise: string;
    
    @ApiProperty()
        postDate: string;
}
