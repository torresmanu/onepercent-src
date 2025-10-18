import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../user/entities/user.entity";
import {BaseService} from "../../common/services/base.service";
import {ActivityCategory} from "./entities/activity-category.entity";

@Injectable()
export class ActivityCategoryService extends BaseService<ActivityCategory> {

    constructor(
        @InjectRepository(ActivityCategory)
        private readonly activityCategoryRepository: Repository<ActivityCategory>,
    ) {
        super(activityCategoryRepository);
    }

    async delete(activityCategoryId: number): Promise<void> {
        // Delete relationships
        // ...

        await super.delete(activityCategoryId);
    }
}
