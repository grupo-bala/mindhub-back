import { ApiProperty } from "@nestjs/swagger";

export class VoteScoreDto {
    @ApiProperty()
        postId: number;
    
    @ApiProperty()
        value: number;
}