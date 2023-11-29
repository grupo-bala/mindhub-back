import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
    @ApiProperty()
        postId: number;
    
    @ApiProperty()
        content: string;
}