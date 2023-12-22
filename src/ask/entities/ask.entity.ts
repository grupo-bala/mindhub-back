import { Expertise } from "src/expertise/entities/expertise.entity";
import { Post } from "src/post/entities/post.entity";
import { ChildEntity, Column, ManyToOne } from "typeorm";

@ChildEntity()
export class Ask extends Post {
    @ManyToOne(() => Expertise, expertise => expertise.title)
        expertise: Expertise;

    @Column({ default: false })
        hasImage: boolean;

    @Column({ nullable: false, default: false })
        hasBestAnswer: boolean;
}
