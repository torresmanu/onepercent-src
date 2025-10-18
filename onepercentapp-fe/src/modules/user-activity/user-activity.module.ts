import {forwardRef, Module} from '@nestjs/common';
import { UserActivityController } from './user-activity.controller';
import { UserActivityService } from './user-activity.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {BusinessModule} from "../business.module";
import {UserActivityTarget} from "./entities/userActivityTarget.entity";
import {UserActivity} from "./entities/userActivity.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserActivity, UserActivityTarget]),
    forwardRef(() => BusinessModule),
  ],
  controllers: [UserActivityController],
  providers: [UserActivityService],
  exports: [UserActivityService, TypeOrmModule],
})
export class UserActivityModule {}
