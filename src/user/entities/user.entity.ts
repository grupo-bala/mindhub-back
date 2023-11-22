import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { Expertise } from "src/expertise/entities/expertise.entity";
import { Post } from "src/post/entities/post.entity";
import { Badge } from "src/badge/entities/badge.entity";

@Entity()
export class User {
    @PrimaryColumn()
        username: string;

    @Column()
        name: string;

    @Column({ unique: true })
        email: string;

    @Exclude()
    @Column({ nullable: false })
        hashPassword: string;

    @Column({ nullable: false, default: 0 })
        xp: number;
    
    @ManyToOne(() => Badge, badge => badge.currentUsers)
        currentBadge: Badge;
    
    @ManyToMany(() => Badge, badge => badge.id)
    @JoinTable()
        badges: Badge[];

    @OneToMany(() => Post, post => post.user)
        post: Post[];
    
    @ManyToMany(() => Expertise, expertise => expertise.title)
    @JoinTable()
        expertises: Expertise[];
}