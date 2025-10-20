import {
    BadRequestException,
    ConflictException, forwardRef, Inject,
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {UserService} from "../user/user.service";
import {UserToken} from "../user/entities/userToken.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {MailService} from "../../common/mail/mail.service";
import {ResetPasswordService} from "../reset-password/reset-password.service";
import {EmailValidation} from "./entities/email-validation.entity";
import appleSigninAuth from "apple-signin-auth";
import * as moment from "moment";
import {OAuth2Client} from "google-auth-library";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import {LicenseService} from "../license/license.service";
import { randomBytes } from 'crypto';


@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);

    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        private jwtService: JwtService,
        @InjectRepository(UserToken)
        private userTokenRepository: Repository<UserToken>,
        private mailService: MailService,
        private resetPasswordService: ResetPasswordService,
        @InjectRepository(EmailValidation)
        private emailValidationRepository: Repository<EmailValidation>,
        private readonly licenseService: LicenseService,
    ) {}

    async emailExists(email: string): Promise<boolean> {
        const user = await this.userService.findOneByEmail(email);
        return !!user;
    }

    async refreshToken(refreshToken: string){
        // 1. Verifica firma del refresh token
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
        }catch(e: any){
            this.logger.error(`Error verifying refresh token: ${e.message}`);
            throw new UnauthorizedException('Invalid refresh token');
        }

        console.log(payload);

        const userId = payload.id;
        // 2. Busca el usuario por ID
        const user = await this.userService.findById(userId);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // console.log("user", user);
        // console.log("refreshToken", refreshToken);
        if (user.refreshToken !== refreshToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        // Check user license
        await this.licenseService.checkUserLicense(user.id);

        const userPayload = { email: user.email, id: user.id };
        const token = this.jwtService.sign(userPayload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRATION || '1d',
        });

        // Save new token in the database
        await this.userTokenRepository.save({ token, user });

        return { access_token: token, user: await this.userService.findOneByEmail(user.email) };

    }

    async login(email: string, password: string) {
        let user = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        if (!user.validatedEmail) {
            throw new UnauthorizedException('Email not validated');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Incorrect password');
        }

        // Check user license
        await this.licenseService.checkUserLicense(user.id);

        const payload = { email: user.email, id: user.id };
        const token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRATION || '1d',
        });

        // Generar de nuevo un RefreshToken válido
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
        });

        // Actualizar el usuario con el nuevo refresh token
        await this.userService.update(user.id, { refreshToken });

        // Guardar el token en la base de datos
        const userToken = this.userTokenRepository.create({ token, user });
        await this.userTokenRepository.save(userToken);

        return { access_token: token, user: await this.userService.findOneByEmail(email) };
    }

    async googleLogin(idToken: string, email: string, displayName: string, imageProfile: string) {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        let ticket: any;
        try {
            ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
                // Or, if multiple clients access the backend:
                //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
            });
        }catch(err) {
            this.logger.error('Error verifying Google ID token', err);
            throw new UnauthorizedException('Invalid Google ID token: ' + err);
        }
        const jwtPayload = ticket.getPayload();
        if (!jwtPayload) {
            throw new UnauthorizedException('Invalid token');
        }
        console.log("jwtPayload", jwtPayload);
        // Commented for future users
        // const userid = payload['sub'];

        // If request specified a G Suite domain:
        // const domain = payload["hd"];

        let user = await this.userService.findOneByEmail(jwtPayload["email"]);
        if (!user) {
            // await errorMiddleware.sendError(404, "0502013", res);
            user = await this.userService.create({
                email: jwtPayload["email"] ? jwtPayload["email"] : email,
                firstname: displayName || "Apple User",
                lastname: displayName || "Apple User",
                imageProfile,
                roleId: 2, // Standard user
                validatedEmail: moment().toDate(),
                password: await bcrypt.hash(randomBytes(16).toString('hex'), 10),
                uuid: uuidv4(), // Generate a UUID for the user
                isSocialUser: true,
            });
            this.logger.debug(`User ${user.email} registered via Google, username ${user.firstname}`);

        }
        // 3️⃣ Generar tokens de autenticación
        const payload = { email: user.email, id: user.id };
        const token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRATION || '1d',
        });

        // Generar de nuevo un RefreshToken válido
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
        });

        // Actualizar el usuario con el nuevo refresh token
        user = await this.userService.update(user.id, { refreshToken });

        // Check user license
        await this.licenseService.checkUserLicense(user.id);

        // Guardar el token en la base de datos
        const userToken = this.userTokenRepository.create({ token, user });
        await this.userTokenRepository.save(userToken);


        this.logger.debug(`User logged in via Google`, user);
        return { access_token: token, user };

    }

    async appleLogin(idToken: string, email: string, displayName: string, imageProfile: string) {
        // 1️⃣ Verificar el token de Apple
        let decodedToken: any;
        try {
            decodedToken = await appleSigninAuth.verifyIdToken(idToken, {
                audience: process.env.APPLE_CLIENT_ID, // CLIENT_ID de la app
            });
        }catch(err) {
            this.logger.error('Error verifying Apple ID token', err);
            throw new UnauthorizedException('Invalid Apple ID token: ' + err);
        }

        this.logger.debug(`User decoded token`, decodedToken);
        const { email: appleEmail, sub: appleUserId } = decodedToken;
        this.logger.debug(`User email logged in via Apple, email: ${email}`);

        // 2️⃣ Buscar o registrar el usuario en la base de datos
        let user = await this.userService.findOneByEmail(email);

        if (!user) {
            user = await this.userService.create({
                email: appleEmail || email,
                firstname: displayName || "Apple User",
                lastname: displayName || "Apple User",
                imageProfile,
                roleId: 2, // Standard user
                validatedEmail: moment().toDate(),
                password: await bcrypt.hash(randomBytes(16).toString('hex'), 10),
                uuid: uuidv4(), // Generate a UUID for the user
                isSocialUser: true,

            });

            this.logger.debug(`User ${user.email} registered via Apple, username ${user.firstname}`);
        }

        // 3️⃣ Generar tokens de autenticación
        const payload = { email: user.email, id: user.id };
        const token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRATION || '1d',
        });

        // Generar de nuevo un RefreshToken válido
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
        });

        // Actualizar el usuario con el nuevo refresh token
        user = await this.userService.update(user.id, { refreshToken });

        // Check user license
        await this.licenseService.checkUserLicense(user.id);

        // Guardar el token en la base de datos
        const userToken = this.userTokenRepository.create({ token, user });
        await this.userTokenRepository.save(userToken);

        this.logger.debug(`User logged in via Apple`, user);
        return { access_token: token, user };
    }

    async metaLogin(idToken: string) {
        try {
            // 1. Obtener perfil del usuario desde Facebook
            const fbRes = await axios.get(
                `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${idToken}`
            );

            const fbProfile = fbRes.data;

            // 2️⃣ Buscar o registrar el usuario en la base de datos
            let user = await this.userService.findOneByEmail(fbProfile.email);

            if (!user) {
                user = await this.userService.create({
                    email: fbProfile.email,
                    firstname: fbProfile.name || "Meta User",
                    lastname: "Meta User",
                    imageProfile: fbProfile.picture?.data?.url,
                    roleId: 2, // Standard user
                    validatedEmail: moment().toDate(),
                    password: await bcrypt.hash(randomBytes(16).toString('hex'), 10),
                    uuid: uuidv4(), // Generate a UUID for the user
                    isSocialUser: true,
                    
                });

                this.logger.debug(`User ${user.email} registered via Apple, username ${user.firstname}`);
            }

            // 3️⃣ Generar tokens de autenticación
            let token: any;
            try{
                const payload = { email: user.email, id: user.id };
                token = this.jwtService.sign(payload);
            }catch(err) {
                this.logger.error('Error generating JWT token', err);
                throw new UnauthorizedException('Error generating JWT token: ' + err);
            }

            // Check user license
            await this.licenseService.checkUserLicense(user.id);

            // Guardar el token en la base de datos
            const userToken = this.userTokenRepository.create({ token, user });
            await this.userTokenRepository.save(userToken);

            this.logger.debug(`User logged in via Apple`, user);
            return { access_token: token, user };

        } catch (err) {
            console.error('Error al validar token de Meta:', err.response?.data || err.message);
            throw new UnauthorizedException('Meta token not valid: ' + err);
        }
    }

    async logout(userId: number) {
        await this.userTokenRepository.delete({ user: { id: userId } });
    }

    async resetPasswordEmail(email: string, platform: string, appScheme: string) {
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        await this.mailService.sendEmailResetPassword(user, platform, appScheme);
    }

    async setNewPassword(token: string, password: string) {
        const resetPasswordToken = await this.resetPasswordService.findByToken(token);
        if (!resetPasswordToken) {
            throw new UnauthorizedException('Token no válido');
        }
        const user = await this.userService.findOneByEmail(resetPasswordToken.email);
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await this.userService.update(user.id, { password: hashedPassword });

        // Eliminar el token después de usarlo
        await this.resetPasswordService.delete(resetPasswordToken.id);

        return user;
    }

    async setNewOldPassword(oldPassword: string, password: string, userId: number) {
        let user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        // Comprobar la contraseña antigua
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            throw new ConflictException('Contraseña antigua incorrecta');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        return await this.userService.update(user.id, { password: hashedPassword });
    }

    async validateAccount(token: string){
        const emailValidation = await this.emailValidationRepository.findOne({ where: { token } });
        if (!emailValidation) {
            throw new UnauthorizedException('Token no válido');
        }

        const user = await this.userService.findOneByEmail(emailValidation.email);
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        // Validar la cuenta del usuario
        user.validatedEmail = new Date();
        await this.userService.update(user.id, { validatedEmail: user.validatedEmail });

        // Eliminar el token después de usarlo
        await this.emailValidationRepository.delete(emailValidation.id);

        return user;
    }

}