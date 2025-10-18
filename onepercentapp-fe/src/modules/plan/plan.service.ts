import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ActiveData} from "./entities/activeData.entity";
import {WorkoutWeek} from "./entities/workoutWeek.entity";
import {In, Repository} from "typeorm";
import {BaseService} from "../../common/services/base.service";
import {HydrationDay} from "./entities/hydrationDay.entity";
import {LunchDay} from "./entities/lunchDay.entity";
import {VegetablesAndFruits} from "./entities/vegetablesAndFruits.entity";
import {CardiovascularLevel} from "./entities/cardiovascularLevel";
import {Allergy} from "./entities/allergy";
import {Intolerance} from "./entities/intolerance";
import {NutritionPreference} from "./entities/nutritionPreference";
import {Gender} from "./entities/gender.entity";
import {Referral} from "./entities/referral.entity";
import {SetInitialAnswersDto} from "./dto/setInitialAnswers.dto";
import {UserService} from "../user/user.service";
import {User} from "../user/entities/user.entity";
import {SetBasicActivityPlanAnswersDto} from "./dto/setBasicActivityPlanAnswers.dto";
import {SetProActivityPlanAnswersDto} from "./dto/setProActivityPlanAnswers.dto";
import {SetProAllergyPlanAnswersDto} from "./dto/setProAllergyPlanAnswers.dto";
import {UserActivityService} from "../user-activity/user-activity.service";

@Injectable()
export class PlanService {

    constructor(
        @InjectRepository(ActiveData)
        private readonly activeDataRepository: Repository<ActiveData>,

        @InjectRepository(HydrationDay)
        private readonly hydrationDayRepository: Repository<HydrationDay>,

        @InjectRepository(LunchDay)
        private readonly lunchDayRepository: Repository<LunchDay>,

        @InjectRepository(VegetablesAndFruits)
        private readonly vegetablesAndFruitsRepository: Repository<VegetablesAndFruits>,

        @InjectRepository(WorkoutWeek)
        private readonly workoutWeekRepository: Repository<WorkoutWeek>,

        @InjectRepository(CardiovascularLevel)
        private readonly cardiovascularLevelRepository: Repository<CardiovascularLevel>,

        @InjectRepository(Allergy)
        private readonly allergyRepository: Repository<Allergy>,

        @InjectRepository(Intolerance)
        private readonly intoleranceRepository: Repository<Intolerance>,

        @InjectRepository(NutritionPreference)
        private readonly nutritionPreferenceRepository: Repository<NutritionPreference>,

        @InjectRepository(Gender)
        private readonly genderRepository: Repository<Gender>,

        @InjectRepository(Referral)
        private readonly referralRepository: Repository<Referral>,

        private readonly userService: UserService,
        private readonly userActivityService: UserActivityService

    ) {
    }

    async setActiveData(activeData: ActiveData): Promise<ActiveData> {
        // Check if the activeData already exists
        const existingActiveData = await this.activeDataRepository.findOne({ where: { title: activeData.title } });
        if (existingActiveData) {
            return existingActiveData;
        }
        return this.activeDataRepository.save(activeData);
    }

    async getActiveData(activeDataId: number): Promise<ActiveData | null> {
        return this.activeDataRepository.findOne({ where: { id: activeDataId } });
    }

    async getAllActiveData(){
        return this.activeDataRepository.find();
    }

    async setHydrationData(hydrationDay: HydrationDay): Promise<HydrationDay> {
        // Check if the hydrationDay already exists
        const existingHydrationDay = await this.hydrationDayRepository.findOne({ where: { title: hydrationDay.title } });
        if (existingHydrationDay) {
            return existingHydrationDay;
        }
        return this.hydrationDayRepository.save(hydrationDay);
    }

    async getHydrationData(hydrationDayId: number): Promise<HydrationDay | null> {
        return this.hydrationDayRepository.findOne({ where: { id: hydrationDayId } });
    }

    async getAllHydrationData() {
        return this.hydrationDayRepository.find();
    }

    async setLunchData(lunchDay: LunchDay): Promise<LunchDay> {
        // Check if the lunchDay already exists
        const existingLunchDay = await this.lunchDayRepository.findOne({ where: { title: lunchDay.title } });
        if (existingLunchDay) {
            return existingLunchDay;
        }
        return this.lunchDayRepository.save(lunchDay);
    }

    async getLunchData(lunchDayId: number): Promise<LunchDay | null> {
        return this.lunchDayRepository.findOne({ where: { id: lunchDayId } });
    }

    async getAllLunchData() {
        return this.lunchDayRepository.find();
    }

    async setVegetablesAndFruitsData(vegetablesAndFruits: VegetablesAndFruits): Promise<VegetablesAndFruits> {
        // Check if the vegetablesAndFruits already exists
        const existingVegetablesAndFruits = await this.vegetablesAndFruitsRepository.findOne({ where: { title: vegetablesAndFruits.title } });
        if (existingVegetablesAndFruits) {
            return existingVegetablesAndFruits;
        }
        return this.vegetablesAndFruitsRepository.save(vegetablesAndFruits);
    }

    async getVegetablesAndFruitsData(vegetablesAndFruitsId: number): Promise<VegetablesAndFruits | null> {
        return this.vegetablesAndFruitsRepository.findOne({ where: { id: vegetablesAndFruitsId } });
    }

    async getAllVegetablesAndFruitsData() {
        return this.vegetablesAndFruitsRepository.find();
    }

    async setWorkoutWeekData(workoutWeek: WorkoutWeek): Promise<WorkoutWeek> {
        // Check if the workoutWeek already exists
        const existingWorkoutWeek = await this.workoutWeekRepository.findOne({ where: { title: workoutWeek.title } });
        if (existingWorkoutWeek) {
            return existingWorkoutWeek;
        }
        return this.workoutWeekRepository.save(workoutWeek);
    }

    async getWorkoutWeekData(workoutWeekId: number): Promise<WorkoutWeek | null> {
        return this.workoutWeekRepository.findOne({ where: { id: workoutWeekId } });
    }

    async getAllWorkoutWeekData() {
        return this.workoutWeekRepository.find();
    }

    async setCardiovascularLevelData(cardiovascularLevel: CardiovascularLevel): Promise<CardiovascularLevel> {
        // Check if the cardiovascularLevel already exists
        const existingCardiovascularLevel = await this.cardiovascularLevelRepository.findOne({ where: { title: cardiovascularLevel.title } });
        if (existingCardiovascularLevel) {
            return existingCardiovascularLevel;
        }
        return this.cardiovascularLevelRepository.save(cardiovascularLevel);
    }

    async getCardiovascularLevelData(cardiovascularLevelId: number): Promise<CardiovascularLevel | null> {
        return this.cardiovascularLevelRepository.findOne({ where: { id: cardiovascularLevelId } });
    }

    async getAllCardiovascularLevels() {
        return this.cardiovascularLevelRepository.find();
    }

    async setAllergyData(allergy: Allergy): Promise<Allergy> {
        // Check if the allergy already exists
        const existingAllergy = await this.allergyRepository.findOne({ where: { title: allergy.title } });
        if (existingAllergy) {
            return existingAllergy;
        }
        return this.allergyRepository.save(allergy);
    }

    async getAllergyData(allergyId: number): Promise<Allergy | null> {
        return this.allergyRepository.findOne({ where: { id: allergyId } });
    }

    async getAllAllergyData() {
        return this.allergyRepository.find();
    }

    async setIntoleranceData(intolerance: Intolerance): Promise<Intolerance> {
        // Check if the intolerance already exists
        const existingIntolerance = await this.intoleranceRepository.findOne({ where: { title: intolerance.title } });
        if (existingIntolerance) {
            return existingIntolerance;
        }
        return this.intoleranceRepository.save(intolerance);
    }

    async getIntoleranceData(intoleranceId: number): Promise<Intolerance | null> {
        return this.intoleranceRepository.findOne({ where: { id: intoleranceId } });
    }

    async getAllIntoleranceData() {
        return this.intoleranceRepository.find();
    }

    async setNutritionPreferenceData(nutritionPreference: NutritionPreference): Promise<NutritionPreference> {
        // Check if the nutritionPreference already exists
        const existingNutritionPreference = await this.nutritionPreferenceRepository.findOne({ where: { title: nutritionPreference.title } });
        if (existingNutritionPreference) {
            return existingNutritionPreference;
        }
        return this.nutritionPreferenceRepository.save(nutritionPreference);
    }

    async getNutritionPreferenceData(nutritionPreferenceId: number): Promise<NutritionPreference | null> {
        return this.nutritionPreferenceRepository.findOne({ where: { id: nutritionPreferenceId } });
    }

    async getAllNutritionPreferenceData() {
        return this.nutritionPreferenceRepository.find();
    }

    async getGenderData(genderId: number){
        return this.genderRepository.findOne({ where: { id: genderId } });
    }

    async getAllGenders(){
        return this.genderRepository.find();
    }

    async setGender(title: string){
        // Check if gender exists
        const existingGender = await this.genderRepository.findOne({ where: { title } });
        if (existingGender) {
            return existingGender;
        }
        return await this.genderRepository.save({title})
    }

    async setReferral(referral: string): Promise<Referral> {
        // Check if the referral already exists
        const existingReferral = await this.referralRepository.findOne({ where: { title: referral } });
        if (existingReferral) {
            return existingReferral;
        }
        return this.referralRepository.save({title: referral});
    }

    async getAllReferrals(): Promise<Referral[]> {
        return this.referralRepository.find();
    }

    // Target calculation helper methods

    // Calculate RMB (Basal Metabolic Rate) with Harris-Benedict formula
    async calculateRMBInKcal(weight: number, height: number, age: number, genderId?: number, workoutWeekId?: number): Promise<number> {
        let rmb: number;
        if (genderId === 1){ // Male
            rmb = 66 + (13.75 * weight) + (5 * height) - (6.75 * age);
        }else if (genderId === 2 ){ // Female
            rmb = 655 + (9.56 * weight) + (1.85 * height) - (4.68 * age);
        }else{
            // Other
            rmb = 66 + (13.75 * weight) + (5 * height) - (6.75 * age);
        }

        // Apply activity factor
        if (workoutWeekId) {
            const workoutWeek = await this.getWorkoutWeekData(workoutWeekId);
            if (workoutWeek) {
                return Math.round(rmb * workoutWeek.factor);
            }
        }

        return Math.round(rmb);
    }

    async calculateStepsPerDay(activeDataId: number): Promise<number> {
        const activeData = await this.getActiveData(activeDataId);
        if (!activeData) {
            throw new NotFoundException('Active data not found');
        }
        if (activeData.id === 1) { // Sedentary;
            return 6000;
        }else if (activeData.id === 2) { // Lightly active
            return 7000;
        }else if (activeData.id === 3) {
            return 9000;
        }else{
            return 5000;
        }
    }

    async calculateWorkoutMinutesPerWeek(workoutWeekId: number, cardiovascularLevelId?: number): Promise<number> {
        const workoutWeek = await this.getWorkoutWeekData(workoutWeekId);
        if (!workoutWeek) {
            throw new NotFoundException('Workout week data not found');
        }
        let cardiovascularLevel: any;
        if (cardiovascularLevelId) {
            cardiovascularLevel = await this.getCardiovascularLevelData(cardiovascularLevelId);
            if (!cardiovascularLevel) {
                throw new NotFoundException('Cardiovascular level data not found');
            }
        }
        // Calculate total weekly workout time
        let totalWeeklyMinutes = 0;
        if (workoutWeekId === 1) { // No exercise
            totalWeeklyMinutes = 60;

            if (cardiovascularLevel) {
                // Apply cardiovascular level factor
                if (cardiovascularLevelId === 1) {
                    totalWeeklyMinutes = 60;
                } else if (cardiovascularLevelId === 2) {
                    totalWeeklyMinutes = 60;
                } else if (cardiovascularLevelId === 3) {
                    totalWeeklyMinutes = 90;
                } else if (cardiovascularLevelId === 4) {
                    totalWeeklyMinutes = 90;
                }
            }

        }else if (workoutWeekId === 2) { // 2-3 days
            totalWeeklyMinutes = 120;

            if (cardiovascularLevel) {
                // Apply cardiovascular level factor
                if (cardiovascularLevelId === 1) {
                    totalWeeklyMinutes = 120;
                } else if (cardiovascularLevelId === 2) {
                    totalWeeklyMinutes = 120;
                } else if (cardiovascularLevelId === 3) {
                    totalWeeklyMinutes = 150;
                } else if (cardiovascularLevelId === 4) {
                    totalWeeklyMinutes = 150;
                }
            }
        }else if (workoutWeekId === 3) { // 4-5 days
            totalWeeklyMinutes = 180;

            if (cardiovascularLevel) {
                // Apply cardiovascular level factor
                if (cardiovascularLevelId === 1){
                    totalWeeklyMinutes = 150;
                }else if (cardiovascularLevelId === 2){
                    totalWeeklyMinutes = 180;
                }else if (cardiovascularLevelId === 3){
                    totalWeeklyMinutes = 210;
                }else if (cardiovascularLevelId === 4){
                    totalWeeklyMinutes = 240;
                }
            }
        }else if (workoutWeekId === 4) { // 6+ days
            totalWeeklyMinutes = 240;

            if (cardiovascularLevel) {
                // Apply cardiovascular level factor
                if (cardiovascularLevelId === 1) {
                    totalWeeklyMinutes = 210;
                } else if (cardiovascularLevelId === 2) {
                    totalWeeklyMinutes = 240;
                } else if (cardiovascularLevelId === 3) {
                    totalWeeklyMinutes = 240;
                } else if (cardiovascularLevelId === 4) {
                    totalWeeklyMinutes = 270;
                }
            }
        }

        return totalWeeklyMinutes;
    }

    async calculateHydration(){
        // 9 sept 2025: Cliente: el objetivo de hidratación SIEMPRE será EXCELENTE de forma predeterminada y fija. Ya que consideramos que ese tiene que ser el objetivo a cumplir de todo el mundo, aunque tengamos nuestro método de puntuación según el grado de hidratación diaria de cada usuario, el objetivo a cumplir siempre será el mismo para todos.
        return 3; // 3 = Excellent
    }

    async calculateVegetablesAndFruits(): Promise<number> {
        return 5; // 5 porciones de 80g cada una
    }

    async calculateUserTargets(userId: number){
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (!user.workoutWeekId || !user.activeDataId || !user.weight || !user.height || !user.birthdate) {
            throw new NotFoundException('User data incomplete to calculate targets, maybe missing setInitialAnswer call?');
        }

        const workoutMinutesPerWeekTarget = await this.calculateWorkoutMinutesPerWeek(user.workoutWeekId, user.cardiovascularLevelId);
        const stepsPerDayTarget = await this.calculateStepsPerDay(user.activeDataId);
        const hydrationTarget = await this.calculateHydration();
        const age = new Date().getFullYear() - new Date(user.birthdate).getFullYear();
        console.log("User age:", age);
        const nutritionTarget = await this.calculateRMBInKcal(user.weight, user.height, age, user.genderId, user.workoutWeekId);
        const vegetablesAndFruitsTarget = await this.calculateVegetablesAndFruits();
        console.log("Calculated targets:", {
            workoutMinutesPerWeekTarget,
            stepsPerDayTarget,
            hydrationTarget,
            nutritionTarget,
            vegetablesAndFruitsTarget
        });

        // Update targets on user object
        return await this.userService.update(userId, {
            workoutsTarget: workoutMinutesPerWeekTarget,
            stepsTarget: stepsPerDayTarget,
            hydrationTarget: hydrationTarget, // Fixed to Excellent
            nutritionTarget: nutritionTarget,
            vegetablesAndFruitsTarget: vegetablesAndFruitsTarget // Fixed to 5 portions
        });
    }



    // Plan Answers ----------------------------------------------------------------

    async setInitialAnswers(setInitialAnswersDto: SetInitialAnswersDto, userId: number): Promise<User> {
        // Check de user
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        console.log("Setting initial answers for user:", userId);

        // Set active data id for user
        return await this.userService.update(userId, {
            activeDataId: setInitialAnswersDto.activeDataId,
            hydrationDayId: setInitialAnswersDto.hydrationDayId,
            lunchDayId: setInitialAnswersDto.lunchDayId,
            vegetablesAndFruitsId: setInitialAnswersDto.vegetablesAndFruitsId,
            workoutWeekId: setInitialAnswersDto.workoutWeekId,
        });
    }

    async setBasicActivityAnswers(setBasicActivityPlanAnswerDto: SetBasicActivityPlanAnswersDto, userId: number): Promise<User> {
        let user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user = await this.userService.update(userId, {
            birthdate: setBasicActivityPlanAnswerDto.birthdate,
            height: setBasicActivityPlanAnswerDto.height,
            weight: setBasicActivityPlanAnswerDto.weight,
            genderId: setBasicActivityPlanAnswerDto.genderId,
            otherGender: setBasicActivityPlanAnswerDto.gender,
            referralId: setBasicActivityPlanAnswerDto.referralId,
            provinceId: setBasicActivityPlanAnswerDto.provinceId,
        });

        await this.calculateUserTargets(userId);

        return await this.userService.findById(userId);
    }

    async setProActivityAnswers(setProActivityPlanAnswersDto: SetProActivityPlanAnswersDto, userId: number){
        let user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user = await this.userService.update(userId, {
            birthdate: setProActivityPlanAnswersDto.birthdate,
            height: setProActivityPlanAnswersDto.height,
            weight: setProActivityPlanAnswersDto.weight,
            genderId: setProActivityPlanAnswersDto.genderId,
            otherGender: setProActivityPlanAnswersDto.gender,
            referralId: setProActivityPlanAnswersDto.referralId,
            activeDataId: setProActivityPlanAnswersDto.activeDataId,
            workoutWeekId: setProActivityPlanAnswersDto.workoutWeekId,
            cardiovascularLevelId: setProActivityPlanAnswersDto.cardiovascularLevelId,
            targetId: setProActivityPlanAnswersDto.targetId,
        });

        await this.calculateUserTargets(userId);

        return await this.userService.findById(userId);
    }

    async setProAllergyPlanAnswers(setProAllergyPlanAnswersDto: SetProAllergyPlanAnswersDto, userId: number){
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // --- Allergies ---
        if (setProAllergyPlanAnswersDto.allergiesIds?.length) {
            const allergies = await this.allergyRepository.findBy({ id: In(setProAllergyPlanAnswersDto.allergiesIds) });
            if (allergies.length !== setProAllergyPlanAnswersDto.allergiesIds.length) {
                const foundIds = allergies.map(a => a.id);
                const notFound = setProAllergyPlanAnswersDto.allergiesIds.filter(id => !foundIds.includes(id));
                throw new NotFoundException(`Allergies not found: ${notFound.join(', ')}`);
            }
            // Reemplazamos las relaciones existentes con las nuevas
            user.allergies = allergies;
        } else {
            // Si no se envía ninguna allergy, limpiamos las existentes
            user.allergies = [];
        }

        // --- Intolerances ---
        if (setProAllergyPlanAnswersDto.intolerancesIds?.length) {
            const intolerances = await this.intoleranceRepository.findBy({ id: In(setProAllergyPlanAnswersDto.intolerancesIds) });
            if (intolerances.length !== setProAllergyPlanAnswersDto.intolerancesIds.length) {
                const foundIds = intolerances.map(i => i.id);
                const notFound = setProAllergyPlanAnswersDto.intolerancesIds.filter(id => !foundIds.includes(id));
                throw new NotFoundException(`Intolerances not found: ${notFound.join(', ')}`);
            }
            user.intolerances = intolerances;
        } else {
            user.intolerances = [];
        }

        // --- Nutrition Preferences ---
        if (setProAllergyPlanAnswersDto.nutritionPreferencesIds?.length) {
            const nutritionPreferences = await this.nutritionPreferenceRepository.findBy({ id: In(setProAllergyPlanAnswersDto.nutritionPreferencesIds) });
            if (nutritionPreferences.length !== setProAllergyPlanAnswersDto.nutritionPreferencesIds.length) {
                const foundIds = nutritionPreferences.map(n => n.id);
                const notFound = setProAllergyPlanAnswersDto.nutritionPreferencesIds.filter(id => !foundIds.includes(id));
                throw new NotFoundException(`Nutrition Preferences not found: ${notFound.join(', ')}`);
            }
            user.nutritionPreferences = nutritionPreferences;
        } else {
            user.nutritionPreferences = [];
        }

        // --- Guardar cambios ---
        await this.userService.save(user);
        return await this.userService.findById(userId);

    }

    async getActivityProgress(userId: number, daily = false) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (!user.workoutsTarget || !user.stepsTarget) {
            throw new NotFoundException('User targets not set');
        }
        return {
            workoutMinutesDone: (daily) ? await this.userActivityService.calculateUserWorkoutMinutesForToday(user.id) : await this.userActivityService.calculateUserWorkoutMinutesForWeek(user.id),
            workoutMinutesTarget: (daily) ? this.userActivityService.calculateWorkoutMinutesPerDayTarget(user.workoutsTarget) : user.workoutsTarget,
            stepsDone: (daily) ? await this.userActivityService.calculateUserStepsForToday(user.id) : await this.userActivityService.calculateUserStepsForWeek(user.id),
            stepsTarget: user.stepsTarget,
            totalPoints: (daily) ? await this.userActivityService.calculateUserPointsForToday(user.id) : await this.userActivityService.calculateUserPointsForWeek(user.id),
            maxPoints: 300,
            capsuleForToday: null,

        }
    }

    async getActivityProgressForDate(userId: number, date: string) {
        // const user = await this.userService.findById(userId);
        // if (!user) {
        //     throw new NotFoundException('User not found');
        // }
        // if (!user.workoutsTarget || !user.stepsTarget) {
        //     throw new NotFoundException('User targets not set');
        // }
        // return {
        //     workoutMinutesDone: (daily) ? await this.userActivityService.calculateUserWorkoutMinutesForToday(user.id) : await this.userActivityService.calculateUserWorkoutMinutesForWeek(user.id),
        //     workoutMinutesTarget: (daily) ? this.userActivityService.calculateWorkoutMinutesPerDayTarget(user.workoutsTarget) : user.workoutsTarget,
        //     stepsDone: (daily) ? await this.userActivityService.calculateUserStepsForToday(user.id) : await this.userActivityService.calculateUserStepsForWeek(user.id),
        //     stepsTarget: user.stepsTarget,
        //     totalPoints: (daily) ? await this.userActivityService.calculateUserPointsForToday(user.id) : await this.userActivityService.calculateUserPointsForWeek(user.id),
        //     maxPoints: 300,
        //     capsuleForToday: null,
        //
        // }
    }


}
