import { Injectable } from '@nestjs/common';
import {BaseService} from "../../common/services/base.service";
import {ActivityMaterial} from "./entities/activity-material.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class ActivityMaterialService extends BaseService<ActivityMaterial>{

    constructor(
        @InjectRepository(ActivityMaterial)
        private readonly activityMaterialRepository: Repository<ActivityMaterial>,
    ) {
        super(activityMaterialRepository);
    }

    async delete(activityMaterialId: number): Promise<void> {
        // Delete relationships
        // ...

        await super.delete(activityMaterialId);
    }
}
