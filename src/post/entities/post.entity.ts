import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export abstract class Post {
    @PrimaryGeneratedColumn()
        id: number;

    @Column({type: "text", nullable: false})
        title: string;

    @Column({type: "text", nullable: false})
        content: string;

    @OneToOne(() => User, user => user.username)
        user: User;
}