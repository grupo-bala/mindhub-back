import { ApiProperty } from "@nestjs/swagger";

export class CreateAskDto {
    @ApiProperty()
        title: string;

    @ApiProperty()
        content: string;

    @ApiProperty()
        expertise: string;

    @ApiProperty({ required: false })
        image?: Buffer;

    @ApiProperty()
        hasImage: boolean;

    @ApiProperty()
        postDate: string;
}
