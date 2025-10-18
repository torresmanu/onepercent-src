import {forwardRef, Module} from '@nestjs/common';
import { RevenuecatService } from './revenuecat.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../../../modules/user/entities/user.entity";
import {UserToken} from "../../../modules/user/entities/userToken.entity";
import {Role} from "../../../modules/user/entities/role.entity";
import {EmailValidation} from "../../../modules/auth/entities/email-validation.entity";
import {ResetPassword} from "../../../modules/reset-password/entities/reset-password.entity";
import {AuthModule} from "../../../modules/auth/auth.module";
import {UserLicenseService} from "../../../modules/user-license/user-license.service";
import {UserLicense} from "../../../modules/user-license/entities/user-license.entity";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserToken, Role, EmailValidation, ResetPassword, EmailValidation, UserLicense]),
    forwardRef(() => AuthModule),
    forwardRef(() => HttpModule),

  ],  // Usar forwardRef para evitar ciclos],
  providers: [RevenuecatService, UserLicenseService]
})
export class RevenuecatModule {}
