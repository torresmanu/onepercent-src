import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository, Like} from "typeorm";
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

    async search(query: string): Promise<ActivityType[]> {
        if (!query || query.length < 2) {
            return [];
        }
        
        return this.activityTypeRepository.find({
            where: [
                { title: Like(`%${query}%`) },
                { description: Like(`%${query}%`) }
            ],
            take: 20,
            order: { title: 'ASC' }
        });
    }
}
