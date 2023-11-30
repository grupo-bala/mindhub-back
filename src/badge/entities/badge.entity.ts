import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Badge {
    @PrimaryGeneratedColumn()
        id: number;
    
    @Column({ unique: true, type: "text" })
        title: string;

    @Column({ type: "int", default: 0 })
        xp: number;
    
    @OneToMany(() => User, user => user.currentBadge)
        currentUsers: User[];
}