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
    
    @ManyToOne(() => Post, post => post.id)
        post: Post;
}