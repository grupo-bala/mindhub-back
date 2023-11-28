import { Expertise } from "src/expertise/entities/expertise.entity";
import { Post } from "src/post/entities/post.entity";
import { ChildEntity, ManyToOne } from "typeorm";

@ChildEntity()
export class Material extends Post {
    @ManyToOne(() => Expertise, expertise => expertise.title)
        expertise: Expertise;
}