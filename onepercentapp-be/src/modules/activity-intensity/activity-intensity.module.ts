import {forwardRef, Module} from '@nestjs/common';
import { ActivityIntensityService } from './activity-intensity.service';
import { ActivityIntensityController } from './activity-intensity.controller';
import {AuthModule} from "../auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {UserToken} from "../user/entities/userToken.entity";
import {Role} from "../user/entities/role.entity";
import {ActivityIntensity} from "./entities/activity-intensity.entity";
import {BusinessModule} from "../business.module";

@Module({
  imports:[
    TypeOrmModule.forFeature([User, UserToken, Role, ActivityIntensity]),
    // forwardRef(() => AuthModule),
    forwardRef(() => BusinessModule),

  ],

  providers: [ActivityIntensityService],
  controllers: [ActivityIntensityController],
  exports: [ActivityIntensityService]
})
export class ActivityIntensityModule {}
