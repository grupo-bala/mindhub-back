import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { Expertise } from "src/expertise/entities/expertise.entity";

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

    @Column({ nullable: false, default: 0 })
        currentBadge: number;
    
    @ManyToMany(() => Expertise, expertise => expertise.title)
    @JoinTable()
        expertises: Expertise[];
}