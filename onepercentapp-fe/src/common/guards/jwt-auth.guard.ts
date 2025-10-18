import {Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {UserToken} from "../../modules/user/entities/userToken.entity";
import {RequestWithUser} from "../interfaces/requestUser.interface";
import {User} from "../../modules/user/entities/user.entity";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    private logger = new Logger('JwtAuthGuard');
    constructor(
        private jwtService: JwtService,
        @InjectRepository(UserToken)
        private userTokenRepository: Repository<UserToken>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request: RequestWithUser = context.switchToHttp().getRequest();
            const authHeader = request.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new UnauthorizedException('Token no proporcionado');
            }

            const token = authHeader.split(' ')[1];

            const data = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET, // <== asegúrate de pasarla aquí también si no es la misma por defecto
            });
            
            const user = await this.userRepository.findOne({where: {email: data.email}, relations: ['role']});
            const userToken = await this.userTokenRepository.findOne({where: {token}, relations: ['user']});

            if (!userToken) {
                throw new UnauthorizedException('Token invalid!');
            }
            if (!user) {
                throw new UnauthorizedException('User not found!');
            }

            request.user = userToken.user; // Ahora TypeScript reconoce la propiedad
            request.token = token;

            return true;
        }catch (e) {
            this.logger.error(e.message);
            this.logger.error(e);
            throw new UnauthorizedException('Token invalid!');
        }

    }
}