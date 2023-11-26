import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository, TypeOrmModule } from "@nestjs/typeorm";
import { Badge } from "src/badge/entities/badge.entity";
import { Event } from "src/events/entities/event.entity";
import { Expertise } from "src/expertise/entities/expertise.entity";
import { Material } from "src/material/entities/material.entity";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Material,
            Event,
            Badge,
            Expertise
        ]),
    ],
})
export class TestModule {
    constructor(
        private config: ConfigService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Badge)
        private badgeRepository: Repository<Badge>,
        @InjectRepository(Expertise)
        private expertiseRepository: Repository<Expertise>,
        @InjectRepository(Material)
        private materialRepository: Repository<Material>,
        @InjectRepository(Event)
        private eventRepository: Repository<Event>
    ) {
        if (this.config.get("IS_TEST_ENV") === "true") {
            this.saveDefaultEntities();
        }
    }

    private async saveDefaultEntities() {
        const expertise = new Expertise();
        expertise.title = "Matemática";
        expertise.users = [];
        await this.expertiseRepository.save(expertise);

        const badge = new Badge();
        badge.title = "Aprendiz";
        badge.users = [];
        await this.badgeRepository.save(badge);

        const user = new User();
        user.name = "Teste";
        user.email = "teste";
        user.username = "teste";
        user.hashPassword = "$2b$10$Jnw26Q9ceCviEcMchzAqJu1hg1APTbjZQ4Me821ZMa5OV01e7kNQ6",
        user.xp = 0;
        user.badges = [badge];
        user.currentBadge = badge;
        user.expertises = [expertise];
        user.post = [];
        await this.userRepository.save(user);

        const material = new Material();
        material.title = "Material teste";
        material.content = "Teste";
        material.expertise = expertise;
        material.postDate = "0";
        material.user = user;
        await this.materialRepository.save(material);

        const event = new Event();
        event.title = "Event teste";
        event.content = "Teste";
        event.date = "0";
        event.postDate = "0";
        event.latitude = 0;
        event.longitude = 0;
        event.localName = "Local teste";
        event.user = user;
        await this.eventRepository.save(event);
    }
}