import {forwardRef, Module} from '@nestjs/common';
import { ActivityTypeService } from './activity-type.service';
import { ActivityTypeController } from './activity-type.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {UserToken} from "../user/entities/userToken.entity";
import {Role} from "../user/entities/role.entity";
import {AuthModule} from "../auth/auth.module";
import {ActivityType} from "./entities/activity-type.entity";
import {BusinessModule} from "../business.module";

@Module({
  imports:[
    TypeOrmModule.forFeature([User, UserToken, Role, ActivityType]),
    // forwardRef(() => AuthModule),
    forwardRef(() => BusinessModule),

  ],
  providers: [ActivityTypeService],
  controllers: [ActivityTypeController],
  exports: [ActivityTypeService],
})
export class ActivityTypeModule {}
