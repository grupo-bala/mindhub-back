import { Column, Entity, PrimaryColumn } from "typeorm";
import { Exclude } from "class-transformer";

@Entity()
export class User {
    @PrimaryColumn()
        username: string;

    @Column({ unique: true })
        email: string;

    @Exclude()
    @Column({ nullable: false })
        hashPassword: string;

    @Column({ nullable: false, default: 0 })
        xp: number;

    @Column({ nullable: false, default: 0 })
        currentBadge: number;
}