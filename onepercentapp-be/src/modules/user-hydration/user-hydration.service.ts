import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserHydration } from './entities/user-hydration.entity';
import { CreateUserHydrationDto } from './dto/createUserHydration.dto';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class UserHydrationService extends BaseService<UserHydration> {
    constructor(
        @InjectRepository(UserHydration)
        private readonly userHydrationRepository: Repository<UserHydration>,
    ) {
        super(userHydrationRepository);
    }

    /**
     * Create a new hydration record for a user
     */
    async createHydrationRecord(userId: number, createUserHydrationDto: CreateUserHydrationDto): Promise<UserHydration> {
        const hydrationRecord = this.userHydrationRepository.create({
            userId,
            peeColor: createUserHydrationDto.peeColor,
        });

        return await this.userHydrationRepository.save(hydrationRecord);
    }

    /**
     * Get all hydration records for a user
     */
    async getUserHydrationRecords(userId: number): Promise<UserHydration[]> {
        return await this.userHydrationRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Get hydration records for a user by date range
     */
    async getUserHydrationRecordsByDateRange(
        userId: number,
        startDate: Date,
        endDate: Date
    ): Promise<UserHydration[]> {
        return await this.userHydrationRepository
            .createQueryBuilder('hydration')
            .where('hydration.userId = :userId', { userId })
            .andWhere('hydration.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
            .orderBy('hydration.createdAt', 'DESC')
            .getMany();
    }

    /**
     * Get a single hydration record by ID
     */
    async getHydrationRecordById(id: number, userId: number): Promise<UserHydration> {
        const record = await this.userHydrationRepository.findOne({
            where: { id, userId },
        });

        if (!record) {
            throw new NotFoundException(`Hydration record with ID ${id} not found`);
        }

        return record;
    }

    /**
     * Delete a hydration record
     */
    async deleteHydrationRecord(id: number, userId: number): Promise<void> {
        const result = await this.userHydrationRepository.delete({ id, userId });

        if (result.affected === 0) {
            throw new NotFoundException(`Hydration record with ID ${id} not found`);
        }
    }

    /**
     * Get today's hydration records for a user
     */
    async getTodayHydrationRecords(userId: number): Promise<UserHydration[]> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return await this.getUserHydrationRecordsByDateRange(userId, today, tomorrow);
    }
}

