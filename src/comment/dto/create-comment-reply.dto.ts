import { ApiProperty } from "@nestjs/swagger";
import { CreateCommentDto } from "./create-comment.dto";

export class CreateCommentReplyDto extends CreateCommentDto {
    @ApiProperty()
        replyTo: number;
}