import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository, TypeOrmModule } from "@nestjs/typeorm";
import { Ask } from "src/ask/entities/ask.entity";
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
            Ask,
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
        private material1Repository: Repository<Material>,
        @InjectRepository(Event)
        private eventRepository: Repository<Event>,
        @InjectRepository(Ask)
        private askRepository: Repository<Ask>,
    ) {
        if (this.config.get("IS_TEST_ENV") === "true") {
            this.saveDefaultEntities();
        }
    }

    private async saveDefaultEntities() {
        const expertise1 = new Expertise();
        expertise1.title = "Matemática";
        expertise1.users = [];

        const expertise2 = new Expertise();
        expertise2.title = "Português";
        expertise2.users = [];

        await this.expertiseRepository.save([expertise1, expertise2]);

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
        user.expertises = [expertise1];
        user.post = [];
        await this.userRepository.save(user);

        const material1 = new Material();
        material1.title = "Material matemática";
        material1.content = "Teste";
        material1.expertise = expertise1;
        material1.postDate = "0";
        material1.user = user;

        const material2 = new Material();
        material2.title = "Material português";
        material2.content = "Teste";
        material2.expertise = expertise2;
        material2.postDate = "0";
        material2.user = user;

        await this.material1Repository.save([material1, material2]);

        const event = new Event();
        event.title = "Evento teste";
        event.content = "Teste";
        event.date = "0";
        event.postDate = "0";
        event.latitude = 0;
        event.longitude = 0;
        event.localName = "Local teste";
        event.user = user;
        await this.eventRepository.save(event);

        const ask1 = new Ask();
        ask1.title = "Pergunta matemática";
        ask1.content = "Teste";
        ask1.expertise = expertise1;
        ask1.postDate = "0";
        ask1.user = user;

        const ask2 = new Ask();
        ask2.title = "Pergunta português";
        ask2.content = "Teste";
        ask2.expertise = expertise2;
        ask2.postDate = "0";
        ask2.user = user;

        await this.askRepository.save([ask1, ask2]);
    }
}