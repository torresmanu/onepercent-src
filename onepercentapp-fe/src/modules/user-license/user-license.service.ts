import { Injectable } from '@nestjs/common';
import {BaseService} from "../../common/services/base.service";
import {UserLicense} from "./entities/user-license.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {License} from "../license/entities/license.entity";

@Injectable()
export class UserLicenseService extends BaseService<UserLicense>{

    constructor(
        @InjectRepository(UserLicense)
        private readonly userLicenseRepository: Repository<UserLicense>
    ) {
        super(userLicenseRepository);
    }

    async findActiveLicenseOfUser(userId: number){
        return await this.userLicenseRepository.findOne({
            where: {
                user: { id: userId },
                active: true
            },
            relations: ['user']
        });
    }

    async createRaw(userLicense: any){
        return await this.userLicenseRepository.save(userLicense);
    }

    async setAllOldLicensesInactive(userId: number) {
        return await this.userLicenseRepository.update({ user: { id: userId } }, { active: false });
    }
}
