import {forwardRef, Module} from '@nestjs/common';
import { UserPointService } from './user-point.service';
import { UserPointController } from './user-point.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {UserToken} from "../user/entities/userToken.entity";
import {Role} from "../user/entities/role.entity";
import {EmailValidation} from "../auth/entities/email-validation.entity";
import {ResetPassword} from "../reset-password/entities/reset-password.entity";
import {UserLicense} from "../user-license/entities/user-license.entity";
import {AuthModule} from "../auth/auth.module";
import {UserPoint} from "./entities/user-point.entity";
import {UserService} from "../user/user.service";
import {MailService} from "../../common/mail/mail.service";
import {LicenseService} from "../license/license.service";
import {ResetPasswordService} from "../reset-password/reset-password.service";
import {License} from "../license/entities/license.entity";
import {RevenuecatService} from "../../common/payments/revenuecat/revenuecat.service";
import {UserLicenseService} from "../user-license/user-license.service";
import {HttpModule} from "@nestjs/axios";
import {TargetService} from "../target/target.service";
import {Target} from "../target/entities/target.entity";
import {BusinessModule} from "../business.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserToken, Role, EmailValidation, ResetPassword, EmailValidation, UserLicense, UserPoint, License, ResetPassword, Target]),
    // forwardRef(() => AuthModule),
    // forwardRef(() => HttpModule),
    forwardRef(() => BusinessModule),

  ],  // Usar forwardRef para evitar ciclos],
  providers: [UserPointService],
  controllers: [UserPointController],
  exports: [UserPointService],
})
export class UserPointModule {}
