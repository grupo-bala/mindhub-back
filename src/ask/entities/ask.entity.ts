import { Expertise } from "src/expertise/entities/expertise.entity";
import { Post } from "src/post/entities/post.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Ask extends Post {
    @ManyToOne(() => Expertise, expertise => expertise.title)
        expertise: Expertise;

    @Column({ default: false })
        hasImage: boolean;
}
