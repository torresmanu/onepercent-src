import {forwardRef, Module} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import {UserToken} from "../user/entities/userToken.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {User} from "../user/entities/user.entity";
import {MailService} from "../../common/mail/mail.service";
import {ResetPassword} from "../reset-password/entities/reset-password.entity";
import {ResetPasswordService} from "../reset-password/reset-password.service";
import {EmailValidation} from "./entities/email-validation.entity";
import {LicenseService} from "../license/license.service";
import {License} from "../license/entities/license.entity";
import {RevenuecatService} from "../../common/payments/revenuecat/revenuecat.service";
import {UserLicenseService} from "../user-license/user-license.service";
import {UserLicense} from "../user-license/entities/user-license.entity";
import {HttpModule} from "@nestjs/axios";
import {BusinessModule} from "../business.module";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserToken, User, ResetPassword, EmailValidation, License, UserLicense]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || '1234123412341234',
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '24h' 
        },
      }),
    }),
    // forwardRef(() => UserModule),
    // forwardRef(() => HttpModule),
    forwardRef(() => BusinessModule),



  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}