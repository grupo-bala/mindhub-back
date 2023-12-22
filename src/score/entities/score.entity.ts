import { Comment } from "src/comment/entities/comment.entity";
import { Post } from "src/post/entities/post.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Score {
    @PrimaryGeneratedColumn()
        id: number;
    
    @Column({ type: "int" })
        value: number;
    
    @ManyToOne(() => User, user => user.username)
        user: User;
    
    @ManyToOne(() => Post, post => post.id, { onDelete: "CASCADE" })
        post: Post;

    @ManyToOne(() => Comment, comment => comment.id, { onDelete: "CASCADE" })
        comment: Comment;
}
