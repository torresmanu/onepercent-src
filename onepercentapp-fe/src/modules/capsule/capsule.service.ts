import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Capsule} from "./entities/capsule.entity";
import {BaseService} from "../../common/services/base.service";
import {StorageService} from "../../common/storage/storage.service";

@Injectable()
export class CapsuleService extends BaseService<Capsule>{

    constructor(
        @InjectRepository(Capsule)
        private readonly capsuleRepository: Repository<Capsule>,
        private readonly storageService: StorageService,
    ) {
        super(capsuleRepository);
    }

    async createWithThumbnail(capsuleData: Partial<Capsule>, image: Express.Multer.File): Promise<Capsule> {

        const capsule = await super.create(capsuleData);

        // Save thumbnail
        capsule.thumbnail = await this.storageService.saveCapsuleImage(image, capsule.id);
        await this.capsuleRepository.save(capsule);

        return await this.findById(capsule.id);
    }

    async updateWithThumbnail(capsuleId: number, capsuleData: Partial<Capsule>, image: Express.Multer.File): Promise<Capsule> {

        const capsule = await this.update(capsuleId, capsuleData);

        // Save thumbnail
        capsule.thumbnail = await this.storageService.saveCapsuleImage(image, capsule.id);
        await this.capsuleRepository.save(capsule);

        return await this.findById(capsule.id);
    }

    async delete(capsuleId: number): Promise<void> {
        // Delete relationships
        // ...

        await super.delete(capsuleId);
    }
}
