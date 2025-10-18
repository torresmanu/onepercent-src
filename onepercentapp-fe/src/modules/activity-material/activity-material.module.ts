import {forwardRef, Module} from '@nestjs/common';
import { ActivityMaterialService } from './activity-material.service';
import { ActivityMaterialController } from './activity-material.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {UserToken} from "../user/entities/userToken.entity";
import {Role} from "../user/entities/role.entity";
import {AuthModule} from "../auth/auth.module";
import {ActivityMaterial} from "./entities/activity-material.entity";
import {BusinessModule} from "../business.module";

@Module({
  imports:[
    TypeOrmModule.forFeature([User, UserToken, Role, ActivityMaterial]),
    // forwardRef(() => AuthModule),
    forwardRef(() => BusinessModule),

  ],
  providers: [ActivityMaterialService],
  controllers: [ActivityMaterialController],
  exports: [ActivityMaterialService],
})
export class ActivityMaterialModule {}
