import { Post } from "src/post/entities/post.entity";
import { ChildEntity, Column } from "typeorm";

@ChildEntity()
export class Event extends Post {
    @Column({ type: "real" })
        longitude: number;
    
    @Column({ type: "real" })
        latitude: number;
    
    @Column({ type: "text" })
        date: string;
    
    @Column({ type: "text" })
        localName: string;
}
