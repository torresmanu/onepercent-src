import {forwardRef, Module} from '@nestjs/common';
import { UserLicenseService } from './user-license.service';
import { UserLicenseController } from './user-license.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {UserToken} from "../user/entities/userToken.entity";
import {Role} from "../user/entities/role.entity";
import {EmailValidation} from "../auth/entities/email-validation.entity";
import {ResetPassword} from "../reset-password/entities/reset-password.entity";
import {AuthModule} from "../auth/auth.module";
import {UserLicense} from "./entities/user-license.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserToken, Role, EmailValidation, ResetPassword, EmailValidation, UserLicense]),
    forwardRef(() => AuthModule),
  ],  // Usar forwardRef para evitar ciclos],
  providers: [UserLicenseService],
  controllers: [UserLicenseController],
  exports: [UserLicenseService],
})
export class UserLicenseModule {}
