import {BadRequestException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {BaseService} from "../../common/services/base.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserActivity} from "./entities/userActivity.entity";
import {AddStepsByDayDto} from "./dto/addStepsByDay.dto";
import {UserService} from "../user/user.service";
import {AddStepsByDateArrayDto} from "./dto/addStepsByDateArray.dto";
import {RegisterUserActivityDto} from "./dto/registerUserActivity.dto";

@Injectable()
export class UserActivityService extends BaseService<UserActivity>{

    private readonly logger = new Logger(UserActivityService.name);
    constructor(
        @InjectRepository(UserActivity)
        private readonly userActivityRepository: Repository<UserActivity>,

        private readonly userService: UserService
    ) {
        super(userActivityRepository);
    }

    async getById(id: number): Promise<UserActivity> {
        const userActivity = await this.userActivityRepository.findOne({ where: { id }, relations: ['user', 'userActivity', 'capsule'] });
        if (!userActivity) {
            throw new Error(`UserActivity with ID ${id} not found`);
        }
        return userActivity;
    }

    calculateStepPoints(stepTarget: number, stepsDone: number){
        if (stepTarget > 0) {
            return stepsDone * 150 / stepTarget;
        }
        return 0;
    }

    async addUserStepsByDay(addStepsByDayDto: AddStepsByDayDto, userId: number): Promise<UserActivity>{
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        const userActivity = await this.userActivityRepository.save({
            date: addStepsByDayDto.date,
            steps: addStepsByDayDto.steps,
            type: 'steps',
            points: this.calculateStepPoints(Number(user.stepsTarget), addStepsByDayDto.steps),
            userId: user.id,
        });
        return await this.getById(userActivity.id);
    }

    async addUserStepsByDateArray(addStepsByDateArrayDto: AddStepsByDateArrayDto, userId: number): Promise<UserActivity[]>{
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        const mRet: UserActivity[] = [];
        for (const stepEntry of addStepsByDateArrayDto.data) {
            const userActivity = await this.userActivityRepository.save({
                date: stepEntry.date,
                steps: stepEntry.steps,
                type: 'steps',
                points: this.calculateStepPoints(Number(user.stepsTarget), stepEntry.steps),
                userId: user.id,
            });
            mRet.push(userActivity);
        }
        return mRet;
    }

    calculateDistanceInKmsToSteps(userActivity: UserActivity, distanceInKms: number): UserActivity {
        if (distanceInKms && distanceInKms > 0) {
            // Aproximadamente 1 km son 1312 pasos
            const stepsFromDistance = distanceInKms * 1312;
            userActivity.steps = (userActivity.steps && userActivity.steps > 0) ? userActivity.steps + stepsFromDistance : stepsFromDistance;
            this.logger.log("Calculated steps from distance in Kms: " + userActivity.steps);
        }

        return userActivity;
    }

    async calculateIfUserExceededDailyMinutesTarget(userActivity: UserActivity, minutes: number, workoutMinutesPerDayTarget: number, stepsTarget: number): Promise<UserActivity> {
        // Si sobran minutos al día, se registran más actividades el resto de la semana con los mismos datos con el máximo de minutos al día
        if (minutes > workoutMinutesPerDayTarget) {
            let remainingMinutes = minutes - workoutMinutesPerDayTarget;
            let currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 1);
            // while remaining minutes > 0 or week is over
            while (remainingMinutes > 0 && currentDate.getDay() !== 0) { // 0 = Sunday
                const minutesToLog = Math.min(remainingMinutes, workoutMinutesPerDayTarget);
                this.logger.debug("New activity to log on date " + currentDate.toISOString().split('T')[0] + " with minutes " + minutesToLog);
                let newUserActivity = this.userActivityRepository.create({
                    date: currentDate.toISOString().split('T')[0],
                    title: userActivity.title,
                    userActivityRegisterType: userActivity.userActivityRegisterType,
                    userActivityId: userActivity.userActivityId,
                    capsuleId: userActivity.capsuleId,
                    minutes: minutesToLog,
                    steps: userActivity.steps,
                    perceivedEffort: userActivity.perceivedEffort,
                    distanceInKms: userActivity.distanceInKms,
                    userId: userActivity.userId,
                    x2: userActivity.x2,
                    points: 0,
                });
                newUserActivity = this.calculateUserActivityPoints(newUserActivity, minutesToLog, workoutMinutesPerDayTarget, stepsTarget);

                console.log("New user activity to log: ", newUserActivity);
                // Save new UserActivity
                newUserActivity = await this.userActivityRepository.save(newUserActivity);
                this.logger.log("Created new user activity for date " + newUserActivity.date + " with minutes " + newUserActivity.minutes + " and points " + newUserActivity.points);

                remainingMinutes -= minutesToLog;
                // Move to next day
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
        return userActivity;
    }

    calculateUserActivityPoints (userActivity: UserActivity, minutes: number, workoutMinutesPerDayTarget: number, stepsTarget: number): UserActivity {
        userActivity.points = (minutes <= workoutMinutesPerDayTarget) ? minutes * 150 / workoutMinutesPerDayTarget : 150;
        if (userActivity.steps > 0) {
            userActivity.points += this.calculateStepPoints(stepsTarget, userActivity.steps)
        }
        this.logger.log("Calculated user activity points", userActivity.points);
        return userActivity;
    }

    async calculateUserActivityX2Flag(userActivity: UserActivity, perceivedEffort: number, capsuleId: number): Promise<UserActivity> {
        if (capsuleId && capsuleId > 0) {
            // Register based on capsules not manually registered
            const capsule = await this.userActivityRepository.manager.getRepository('Capsule').findOne({ where: { id: capsuleId } });
            if (capsule) {
                if (capsule.activityItensity && capsule.activityIntensity > 1) {
                    //     Only for capsules with intensity 2 or 3 (medium or high)
                    if (perceivedEffort > capsule.perceivedEffort) {
                        userActivity.x2 = true;
                    }
                }
            }else{
                throw new NotFoundException(`Capsule with ID ${capsuleId} not found`);
            }
        }else{
            if (perceivedEffort &&
                (perceivedEffort >= 8 && perceivedEffort <= 10)) {
                userActivity.x2 = true;
            }
        }
        this.logger.log("Calculated x2 flag: " , userActivity.x2);

        return userActivity;
    }

    calculateWorkoutMinutesPerDayTarget(workoutsTarget: number): number {
        return workoutsTarget / 6; // 1 rest day per week
    }

    async calculateUserWorkoutMinutesForToday(userId: number): Promise<number> {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        const today = new Date().toISOString().split('T')[0];
        const userActivities = await this.userActivityRepository.find({ where: { userId: user.id, date: today } });
        let totalMinutes = 0;
        userActivities.forEach(activity => {
            if (activity.minutes && activity.minutes > 0) {
                if (activity.x2){
                    totalMinutes += (activity.minutes * 2);
                }else {
                    totalMinutes += activity.minutes;
                }
            }
        });
        return totalMinutes;
    }

    async calculateUserWorkoutMinutesForWeek(userId: number): Promise<number> {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        const today = new Date();
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday
        const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6)); // Saturday
        const userActivities = await this.userActivityRepository.createQueryBuilder('userActivity')
            .where('userActivity.userId = :userId', { userId: user.id })
            .andWhere('userActivity.date BETWEEN :start AND :end', { start: firstDayOfWeek.toISOString().split('T')[0], end: lastDayOfWeek.toISOString().split('T')[0] })
            .getMany();
        let totalMinutes = 0;
        userActivities.forEach(activity => {
            if (activity.minutes && activity.minutes > 0) {
                if (activity.x2){
                    totalMinutes += (activity.minutes * 2);
                }else {
                    totalMinutes += activity.minutes;
                }
            }
        });
        return totalMinutes;
    }

    async calculateUserStepsForToday(userId: number): Promise<number> {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        const today = new Date().toISOString().split('T')[0];
        const userActivities = await this.userActivityRepository.find({ where: { userId: user.id, date: today } });
        let totalSteps = 0;
        userActivities.forEach(activity => {
            if (activity.steps && activity.steps > 0) {
                totalSteps += activity.steps;
            }
        });
        return totalSteps;
    }

    async calculateUserStepsForWeek(userId: number): Promise<number> {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        const today = new Date();
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday
        const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6)); // Saturday
        const userActivities = await this.userActivityRepository.createQueryBuilder('userActivity')
            .where('userActivity.userId = :userId', { userId: user.id })
            .andWhere('userActivity.date BETWEEN :start AND :end', { start: firstDayOfWeek.toISOString().split('T')[0], end: lastDayOfWeek.toISOString().split('T')[0] })
            .getMany();
        let totalSteps = 0;
        userActivities.forEach(activity => {
            if (activity.steps && activity.steps > 0) {
                totalSteps += activity.steps;
            }
        });
        return totalSteps;
    }

    async calculateUserPointsForToday(userId: number): Promise<number> {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        const today = new Date().toISOString().split('T')[0];
        const userActivities = await this.userActivityRepository.find({ where: { userId: user.id, date: today } });
        let totalPoints = 0;
        userActivities.forEach(activity => {
            if (activity.points && activity.points > 0) {
                if (activity.x2){
                    totalPoints += (activity.points * 2);
                }else{
                    totalPoints += activity.points;
                }
            }
        });
        return totalPoints;
    }

    async calculateUserPointsForWeek(userId: number): Promise<number> {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        const today = new Date();
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday
        const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6)); // Saturday
        const userActivities = await this.userActivityRepository.createQueryBuilder('userActivity')
            .where('userActivity.userId = :userId', { userId: user.id })
            .andWhere('userActivity.date BETWEEN :start AND :end', { start: firstDayOfWeek.toISOString().split('T')[0], end: lastDayOfWeek.toISOString().split('T')[0] })
            .getMany();
        let totalPoints = 0;
        userActivities.forEach(activity => {
            if (activity.points && activity.points > 0) {
                if (activity.x2){
                    totalPoints += (activity.points * 2);
                }else{
                    totalPoints += activity.points;
                }
            }
        });
        return totalPoints;
    }

    async registerUserActivity(registerUserActivityDto: RegisterUserActivityDto, userId: number): Promise<UserActivity>{
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        // User workout target per day
        if (!user.workoutsTarget || user.workoutsTarget <= 0) {
            throw new BadRequestException(`User with ID ${userId} does not have a valid workouts target set`);
        }
        const workoutMinutesPerDayTarget = this.calculateWorkoutMinutesPerDayTarget(user.workoutsTarget); // 1 rest day per week
        this.logger.log("User workout minutes per day target: " + workoutMinutesPerDayTarget);

        // 0 - Create user activity object
        let userActivity = this.userActivityRepository.create({
            date: new Date().toISOString().split('T')[0],
            title: registerUserActivityDto.title,
            userActivityRegisterType: registerUserActivityDto.userActivityRegisterType,
            userActivityId: registerUserActivityDto.activityTypeId,
            capsuleId: registerUserActivityDto.capsuleId,
            minutes: (registerUserActivityDto.minutes <= workoutMinutesPerDayTarget) ? registerUserActivityDto.minutes : workoutMinutesPerDayTarget,
            steps: registerUserActivityDto.steps,
            perceivedEffort: registerUserActivityDto.perceivedEffort,
            distanceInKms: registerUserActivityDto.distanceInKms,
            userId: user.id,
            points: 0,
        });

        // 1 - Calculate steps from distance in Kms if available
        userActivity = this.calculateDistanceInKmsToSteps(userActivity, registerUserActivityDto.distanceInKms);

        // 2 - Calculate activity points for workouts and steps
        userActivity = this.calculateUserActivityPoints(userActivity, registerUserActivityDto.minutes, workoutMinutesPerDayTarget, user.stepsTarget);

        // 3 - Calculate x2 flag
        userActivity = await this.calculateUserActivityX2Flag(userActivity, registerUserActivityDto.perceivedEffort, registerUserActivityDto.capsuleId);

        // 4 - Save activity
        userActivity = await this.userActivityRepository.save(userActivity);

        // 5 - Calculate if user registered more minutes per day than objective
        await this.calculateIfUserExceededDailyMinutesTarget(userActivity, registerUserActivityDto.minutes, workoutMinutesPerDayTarget, user.stepsTarget);

        return await this.getById(userActivity.id);

    }
}
