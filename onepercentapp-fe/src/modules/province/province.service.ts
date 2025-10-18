import { Injectable } from '@nestjs/common';
import {BaseService} from "../../common/services/base.service";
import {Province} from "./entities/province.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class ProvinceService extends BaseService<Province> {
    constructor(
        @InjectRepository(Province)
        private readonly provinceRepository: Repository<Province>
    ) {
        super(provinceRepository);
    }
}
