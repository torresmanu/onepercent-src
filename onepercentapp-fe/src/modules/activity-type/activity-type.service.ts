import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ActivityType} from "./entities/activity-type.entity";
import {BaseService} from "../../common/services/base.service";

@Injectable()
export class ActivityTypeService extends BaseService<ActivityType>{

    constructor(
        @InjectRepository(ActivityType)
        private readonly activityTypeRepository: Repository<ActivityType>,
    ) {
        super(activityTypeRepository);
    }

    async delete(activityTypeId: number): Promise<void> {
        // Delete relationships
        // ...

        await super.delete(activityTypeId);
    }
}
