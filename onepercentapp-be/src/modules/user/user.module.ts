import {forwardRef, Module} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {AuthModule} from "../auth/auth.module";
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {JwtService} from "@nestjs/jwt";
import {UserToken} from "./entities/userToken.entity";
import {Role} from "./entities/role.entity";
import {IsEmailUniqueConstraint} from "../../common/constraints/IsEmailUniqueConstraint";
import {IsInDatabaseConstraint} from "../../common/constraints/IsInDatabaseConstraint";
import {EmailValidation} from "../auth/entities/email-validation.entity";
import {MailService} from "../../common/mail/mail.service";
import {ResetPasswordService} from "../reset-password/reset-password.service";
import {ResetPassword} from "../reset-password/entities/reset-password.entity";
import {LicenseService} from "../license/license.service";
import {License} from "../license/entities/license.entity";
import {RevenuecatService} from "../../common/payments/revenuecat/revenuecat.service";
import {UserLicenseService} from "../user-license/user-license.service";
import {UserLicense} from "../user-license/entities/user-license.entity";
import {HttpModule} from "@nestjs/axios";
import {BusinessModule} from "../business.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserToken, Role, EmailValidation, ResetPassword, EmailValidation, License, UserLicense]),
    // forwardRef(() => AuthModule),
    // forwardRef(() => HttpModule),
    forwardRef(() => BusinessModule),

  ],  // Usar forwardRef para evitar ciclos],
  providers: [ UserService ],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule],

})
export class UserModule {}
