import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryColumn()
        username: string;

    @Column({ unique: true })
        email: string;

    @Column({ nullable: false })
        hashPassword: string;

    @Column({ nullable: false, default: 0 })
        xp: number;

    @Column()
        currentBadge: number;
}