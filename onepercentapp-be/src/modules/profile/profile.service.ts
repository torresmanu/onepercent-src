import {BadRequestException, forwardRef, Inject, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import {NominatimService} from "../../common/geolocation/nominatim.service";
import {MailService} from "../../common/mail/mail.service";
import {UserService} from "../user/user.service";

@Injectable()
export class ProfileService {

    private readonly logger = new Logger(ProfileService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly nominatimService: NominatimService,
        private mailService: MailService,
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
    ) {
    }

    async findMe(userId: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['role'] });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async updateProfileLocation(userId: number, address: string, location: string, province: string, cp: string, country: string): Promise<User> {
        // User id validation
        const user = await this.findMe(userId);

        if (!user.address || !user.location || !user.province || !user.cp || !user.country) {
            throw new BadRequestException('User profile incomplete. Address + Location + Province + CP + Country are required');
        }

        const geo: any = await this.nominatimService.sendQuery(address + ',' + location + ',' + province + ',' + cp + ',' + country);
        if (!geo || geo.length <= 0) {
            throw new BadRequestException('Location not found');
        }
        const point = `POINT(${geo[0].lon} ${geo[0].lat})`;  // Crear un string con la representación del punto
        this.logger.debug("geo", point);
        const userData: Partial<User> = { geo: point };
        return this.userService.update(userId, userData);
    }

    async sendContactFormEmail(message: string, userId: number): Promise<void> {
        const user = await this.findMe(userId);
        // Send email to contact
        const to = process.env.CONTACT_EMAIL || 'habilidosos@armadilloamarillo.com';
        if (to) {
            const target = user.firstname + " " + user.lastname;
            await this.mailService.sendNotification('notification', to, 'Nuevo mensaje enviado desde formulario de contacto de ' + target, message, null, null);

            // Send ACK to user
            if (user.email) {
                await this.mailService.sendNotification('notification', user.email, 'Mensaje enviado a ' + process.env.API_NAME + '.', 'Gracias ' + target + "!. Tu mensaje ha sido enviado al equipo de " + process.env.API_NAME + ". En breve, alguien se pondrá en contacto contigo.", null, null);
            }
        }
    }
}
