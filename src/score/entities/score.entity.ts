import { Post } from "src/post/entities/post.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Score {
    @PrimaryGeneratedColumn()
        id: number;
    
    @Column({ type: "int" })
        value: number;
    
    @OneToOne(() => User)
    @JoinColumn()
        user: User;
    
    @OneToOne(() => Post)
    @JoinColumn()
        post: Post;
}