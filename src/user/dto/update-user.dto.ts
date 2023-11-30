import { ApiProperty } from "@nestjs/swagger";
import { Expertise } from "src/expertise/entities/expertise.entity";

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
        expertises: Expertise[];
}