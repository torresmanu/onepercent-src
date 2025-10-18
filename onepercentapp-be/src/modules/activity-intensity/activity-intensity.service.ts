import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ActivityIntensity} from "./entities/activity-intensity.entity";
import {ActivityCategory} from "../activity-category/entities/activity-category.entity";
import {BaseService} from "../../common/services/base.service";

@Injectable()
export class ActivityIntensityService extends BaseService<ActivityIntensity> {

    constructor(
        @InjectRepository(ActivityIntensity)
        private readonly activityIntensityRepository: Repository<ActivityIntensity>,
    ) {
        super(activityIntensityRepository);
    }

    async delete(activityCategoryId: number): Promise<void> {
        // Delete relationships
        // ...

        await super.delete(activityCategoryId);
    }
}
