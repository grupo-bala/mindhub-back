import { ApiProperty } from "@nestjs/swagger";

export class UpdateBestAnswerDto {
    @ApiProperty()
        postId: number;
}