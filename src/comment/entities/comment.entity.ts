import { Post } from "../../post/entities/post.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
        id: number;

    @ManyToOne(() => User, user => user.username)
        user: User;
    
    @ManyToOne(() => Post, post => post.id)
        post: Post;

    @ManyToOne(() => Comment, comment => comment.id, { nullable: true, onDelete: "CASCADE" })
        replyTo: Comment | null;

    @OneToMany(() => Comment, comment => comment.replyTo, { onDelete: "CASCADE" })
        replies: Comment[];

    @Column()
        content: string;

    @Column()
        isBestAnswer: boolean;
}
