import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
    @ApiProperty()
        name: string;

    @ApiProperty()
        email: string;
    
    @ApiProperty()
        password: string;
    
    @ApiProperty({
        type: [String],
    })
        expertises: string[];
}