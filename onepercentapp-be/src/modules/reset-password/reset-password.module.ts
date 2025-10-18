import {forwardRef, Module} from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";
import {ResetPassword} from "./entities/reset-password.entity";
import {User} from "../user/entities/user.entity";
import {UserToken} from "../user/entities/userToken.entity";
import {Role} from "../user/entities/role.entity";
import {BusinessModule} from "../business.module";

@Module({
  imports:[
    TypeOrmModule.forFeature([User, UserToken, Role, ResetPassword]),
    // forwardRef(() => AuthModule),
    forwardRef(() => BusinessModule),

  ],  // Usar forwardRef para evitar ciclos],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService],
  exports: [ResetPasswordService],
})
export class ResetPasswordModule {}
