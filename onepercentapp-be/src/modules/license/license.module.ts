import {forwardRef, Module} from '@nestjs/common';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {UserToken} from "../user/entities/userToken.entity";
import {Role} from "../user/entities/role.entity";
import {EmailValidation} from "../auth/entities/email-validation.entity";
import {ResetPassword} from "../reset-password/entities/reset-password.entity";
import {UserLicense} from "../user-license/entities/user-license.entity";
import {AuthModule} from "../auth/auth.module";
import {License} from "./entities/license.entity";
import {RevenuecatService} from "../../common/payments/revenuecat/revenuecat.service";
import {UserService} from "../user/user.service";
import {UserLicenseService} from "../user-license/user-license.service";
import {MailService} from "../../common/mail/mail.service";
import {ResetPasswordService} from "../reset-password/reset-password.service";
import {HttpModule} from "@nestjs/axios";
import {BusinessModule} from "../business.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserToken, Role, EmailValidation, ResetPassword, EmailValidation, UserLicense, License]),
    // forwardRef(() => AuthModule),
    // forwardRef(() => HttpModule),
    forwardRef(() => BusinessModule),


  ],  // Usar forwardRef para evitar ciclos],
  providers: [LicenseService],
  controllers: [LicenseController],
  exports: [LicenseService],
})
export class LicenseModule {}
