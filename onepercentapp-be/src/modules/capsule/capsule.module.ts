import {forwardRef, Module} from '@nestjs/common';
import { CapsuleController } from './capsule.controller';
import { CapsuleService } from './capsule.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Capsule} from "./entities/capsule.entity";
import {User} from "../user/entities/user.entity";
import {UserToken} from "../user/entities/userToken.entity";
import {Role} from "../user/entities/role.entity";
import {AuthModule} from "../auth/auth.module";
import {StorageService} from "../../common/storage/storage.service";
import {BusinessModule} from "../business.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserToken, Role, Capsule]),
    // forwardRef(() => AuthModule),
    forwardRef(() => BusinessModule),

  ],  //
  controllers: [CapsuleController],
  providers: [CapsuleService],
  exports: [CapsuleService],
})
export class CapsuleModule {}
