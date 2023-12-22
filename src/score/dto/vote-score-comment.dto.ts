import { ApiProperty } from "@nestjs/swagger";

export class VoteScoreCommentDto {
    @ApiProperty()
        commentId: number;
    
    @ApiProperty()
        value: number;
}