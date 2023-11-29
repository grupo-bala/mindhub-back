import { ApiProperty } from "@nestjs/swagger";

export class UpdateCommentDto {
    @ApiProperty()
        content: string;
}