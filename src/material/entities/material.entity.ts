import { Expertise } from "src/expertise/entities/expertise.entity";
import { Post } from "src/post/entities/post.entity";
import { Entity, OneToMany } from "typeorm";

@Entity()
export class Material extends Post {
    @OneToMany(() => Expertise, expertise => expertise.title)
        expertise: Expertise[];
}