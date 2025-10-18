import {forwardRef, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserPoint} from "./entities/user-point.entity";
import {Repository} from "typeorm";
import {UserService} from "../user/user.service";
import {TargetService} from "../target/target.service";

@Injectable()
export class UserPointService {

    constructor(
        @InjectRepository(UserPoint) // Assuming UserPoint is an entity defined in your application
        private readonly userPointRepository: Repository<UserPoint>, // Assuming UserPointRepository is defined
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly targetService: TargetService
    ) {
        // Constructor logic can be added here if needed
    }

    async getUserPoints(userId: number): Promise<UserPoint[]> {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return await this.userPointRepository.find({
            where: {user: {id: user.id}},
            relations: ['user', 'target'], // Assuming UserPoint has a relation to User0
        });
    }

    async saveUserPoint(points: number, userId: number, targetId: number): Promise<UserPoint> {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const target = await this.targetService.findById(targetId);
        if (!target) {
            throw new NotFoundException('Target not found');
        }

        const userPoint = new UserPoint();
        userPoint.points = points;
        userPoint.user = user; // Assuming UserPoint has a relation to User
        userPoint.target = target; // Assuming UserPoint has a relation to Target

        return await this.userPointRepository.save(userPoint);
    }
}
