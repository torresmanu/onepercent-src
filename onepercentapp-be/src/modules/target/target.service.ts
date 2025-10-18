import { Injectable } from '@nestjs/common';
import {BaseService} from "../../common/services/base.service";
import {Target} from "./entities/target.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class TargetService extends BaseService<Target>{

    constructor(
        // Inject the Target entity repository
        // This allows the service to perform CRUD operations on Target entities
        @InjectRepository(Target) private readonly targetRepository: Repository<Target>
    ) {
        super(targetRepository);
    }

    // Additional methods specific to TargetService can be added here
}
