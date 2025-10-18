import {forwardRef, Module} from '@nestjs/common';
import { TargetService } from './target.service';
import { TargetController } from './target.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {UserToken} from "../user/entities/userToken.entity";
import {Role} from "../user/entities/role.entity";
import {EmailValidation} from "../auth/entities/email-validation.entity";
import {ResetPassword} from "../reset-password/entities/reset-password.entity";
import {UserLicense} from "../user-license/entities/user-license.entity";
import {AuthModule} from "../auth/auth.module";
import {Target} from "./entities/target.entity";
import {BusinessModule} from "../business.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserToken, Role, EmailValidation, ResetPassword, EmailValidation, UserLicense, Target]),
    // forwardRef(() => AuthModule),
    forwardRef(() => BusinessModule),

  ],  // Usar forwardRef para evitar ciclos],

  providers: [TargetService],
  controllers: [TargetController],
  exports: [TargetService],
})
export class TargetModule {}
