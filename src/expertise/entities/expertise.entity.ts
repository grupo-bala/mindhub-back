import { User } from "src/user/entities/user.entity";
import { Entity, ManyToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Expertise {
    @PrimaryColumn({ nullable: false, unique: true })
        title: string;
    
    @ManyToMany(() => User, user => user.expertises)
        users: User[];
}