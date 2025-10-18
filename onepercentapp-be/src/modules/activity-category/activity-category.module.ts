import {forwardRef, Module} from '@nestjs/common';
import { ActivityCategoryService } from './activity-category.service';
import { ActivityCategoryController } from './activity-category.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {UserToken} from "../user/entities/userToken.entity";
import {Role} from "../user/entities/role.entity";
import {AuthModule} from "../auth/auth.module";
import {ActivityCategory} from "./entities/activity-category.entity";
import {BusinessModule} from "../business.module";

@Module({
  imports:[
    TypeOrmModule.forFeature([User, UserToken, Role, ActivityCategory]),
    // forwardRef(() => AuthModule),
    forwardRef(() => BusinessModule),

  ],
  providers: [ActivityCategoryService],
  controllers: [ActivityCategoryController],
  exports: [ActivityCategoryService],
})
export class ActivityCategoryModule {}
