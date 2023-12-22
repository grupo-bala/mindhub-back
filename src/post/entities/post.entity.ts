import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, TableInheritance } from "typeorm";

@Entity()
@TableInheritance({ column: { type: "text", name: "type" } })
export class Post {
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