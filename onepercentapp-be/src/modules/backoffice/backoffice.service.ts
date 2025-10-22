import {forwardRef, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {InjectRepository} from "@nestjs/typeorm";
import {UserToken} from "../user/entities/userToken.entity";
import {Repository} from "typeorm";
import * as bcrypt from "bcrypt";

@Injectable()
export class BackofficeService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        private jwtService: JwtService,
        @InjectRepository(UserToken)
        private userTokenRepository: Repository<UserToken>,
    ) {}

    async login(email: string, password: string) {
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Incorrect password');
        }

        if (Number(user.roleId) !== 1){
            throw new UnauthorizedException('Only admin users can access the backoffice');
        }

        const payload = { email: user.email, id: user.id };
        const token = (this.jwtService as any).sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRATION,
        });

        // Generar de nuevo un RefreshToken válido
        const refreshToken = (this.jwtService as any).sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_EXPIRATION,
        });

        // Actualizar el usuario con el nuevo refresh token
        await this.userService.update(user.id, { refreshToken });

        // Guardar el token en la base de datos
        const userToken = this.userTokenRepository.create({ token, user });
        await this.userTokenRepository.save(userToken);

        return { access_token: token, user: await this.userService.findOneByEmail(email) };
    }

    async logout(userId: number) {
        await this.userTokenRepository.delete({ user: { id: userId } });
    }
}
