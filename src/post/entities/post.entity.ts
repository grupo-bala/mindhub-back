import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export abstract class Post {
    @PrimaryGeneratedColumn()
        id: number;

    @Column({type: "text", nullable: false})
        title: string;

    @Column({type: "text", nullable: false})
        content: string;
    
    @Column({ type: "text" })
        postDate: string;

    @ManyToOne(() => User, user => user.post)
        user: User;
}