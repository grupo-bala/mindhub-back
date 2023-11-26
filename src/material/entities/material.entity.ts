import { Expertise } from "src/expertise/entities/expertise.entity";
import { Post } from "src/post/entities/post.entity";
import { Entity, ManyToOne } from "typeorm";

@Entity()
export class Material extends Post {
    @ManyToOne(() => Expertise, expertise => expertise.title)
        expertise: Expertise;
}