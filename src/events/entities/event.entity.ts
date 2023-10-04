import { Post } from "src/post/entities/post.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Event extends Post {
    @Column({ type: "real" })
        longitude: number;
    
    @Column({ type: "real" })
        latitude: number;
    
    @Column({ type: "timestamp" })
        timestamp: string;
}
