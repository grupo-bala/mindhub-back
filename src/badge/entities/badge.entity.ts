import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Badge {
    @PrimaryGeneratedColumn()
        id: number;
    
    @Column({ unique: true, type: "text" })
        title: string;
    
    @OneToMany(() => User, user => user.currentBadge)
        currentUsers: User[];
    
    @ManyToMany(() => User, user => user.username)
        users: User[];
}