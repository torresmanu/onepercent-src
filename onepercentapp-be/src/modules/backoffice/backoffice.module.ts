import {forwardRef, Module} from '@nestjs/common';
import { BackofficeService } from './backoffice.service';
import { BackofficeController } from './backoffice.controller';
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {JwtModule} from "@nestjs/jwt";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserToken} from "../user/entities/userToken.entity";
import {User} from "../user/entities/user.entity";
import {PassportModule} from "@nestjs/passport";
import {UserModule} from "../user/user.module";
import {MailService} from "../../common/mail/mail.service";
import {ResetPassword} from "../reset-password/entities/reset-password.entity";
import {ResetPasswordService} from "../reset-password/reset-password.service";
import {BusinessModule} from "../business.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserToken, User, ResetPassword]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || '1234123412341234',
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '24h' as any },
    }),
    // forwardRef(() => UserModule),
    forwardRef(() => BusinessModule),

  ],
  controllers: [BackofficeController],
  providers: [BackofficeService],
  exports: [BackofficeService],
})
export class BackofficeModule {}
