import {BadRequestException, Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {PlanService} from "./plan.service";
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {RolesGuard} from "../../common/guards/role.guard";
import {ApiBody, ApiOperation, ApiResponse} from "@nestjs/swagger";
import {TargetService} from "../target/target.service";
import {Roles} from "../../common/decorators/role.decorator";
import {CreateUserDto} from "../user/dto/createUser.dto";
import {User} from "../user/entities/user.entity";
import {validate} from "class-validator";
import {SetInitialAnswersDto} from "./dto/setInitialAnswers.dto";
import {SetBasicActivityPlanAnswersDto} from "./dto/setBasicActivityPlanAnswers.dto";
import {SetProActivityPlanAnswersDto} from "./dto/setProActivityPlanAnswers.dto";
import {SetProAllergyPlanAnswersDto} from "./dto/setProAllergyPlanAnswers.dto";

@Controller('plan')
export class PlanController {
    constructor(
        private readonly planService: PlanService,
        private readonly targetService: TargetService
    ) {
    }

    @Get('getQuestionsOfBasicPlan')
    @ApiOperation({ summary: 'Get all questions for basic questionnaire' })
    @ApiResponse({ status: 200, description: 'List of all questions retrieved successfully.' })

    async getQuestionsOfBasicPlan(): Promise<any> {
        const activeData = await this.planService.getAllActiveData();
        const hydrationData = await this.planService.getAllHydrationData();
        const lunchData = await this.planService.getAllLunchData();
        const vegetablesAndFruitsData = await this.planService.getAllVegetablesAndFruitsData();
        const workoutWeeks = await this.planService.getAllWorkoutWeekData();
        const targetsData = await this.targetService.findAll();
        const genders = await this.planService.getAllGenders();
        const referrals = await this.planService.getAllReferrals();

        return {
            activeData,
            hydrationData,
            lunchData,
            vegetablesAndFruitsData,
            workoutWeeks,
            targetsData,
            genders,
            referrals
        };
    }

    @Get('getQuestionsOfProPlan')
    @ApiOperation({ summary: 'Get all questions for pro questionnaire' })
    @ApiResponse({ status: 200, description: 'List of all questions retrieved successfully.' })

    async getQuestionsOfProPlan(): Promise<any> {
        const activeData = await this.planService.getAllActiveData();
        const workoutWeeks = await this.planService.getAllWorkoutWeekData();
        const cardiovascularLevels = await this.planService.getAllCardiovascularLevels();
        const targetsData = await this.targetService.findAll();
        const allergiesData = await this.planService.getAllAllergyData();
        const intolerancesData = await this.planService.getAllIntoleranceData();
        const nutritionPreferencesData = await this.planService.getAllNutritionPreferenceData();
        const genders = await this.planService.getAllGenders();
        const referrals = await this.planService.getAllReferrals();

        return {
            activeData,
            cardiovascularLevels,
            allergiesData,
            intolerancesData,
            nutritionPreferencesData,
            workoutWeeks,
            targetsData,
            genders,
            referrals
        };
    }

    @Get('getFormMeta')
    @ApiOperation({ summary: 'Get all questions for all questionnaire' })
    @ApiResponse({ status: 200, description: 'List of all questions retrieved successfully.' })

    async getFormMeta(): Promise<any> {
        const activeData = await this.planService.getAllActiveData();
        const workoutWeeks = await this.planService.getAllWorkoutWeekData();
        const cardiovascularLevels = await this.planService.getAllCardiovascularLevels();
        const targetsData = await this.targetService.findAll();
        const allergiesData = await this.planService.getAllAllergyData();
        const intolerancesData = await this.planService.getAllIntoleranceData();
        const nutritionPreferencesData = await this.planService.getAllNutritionPreferenceData();
        const hydrationData = await this.planService.getAllHydrationData();
        const vegetablesAndFruitsData = await this.planService.getAllVegetablesAndFruitsData();

        const ids = [1, 2, 3, 4];
        const idsPlan2 = [5, 6, 7, 8];

        return {
            initForm: {
                activeData,
                workoutWeeks: workoutWeeks.filter((workout: any) => ids.includes(workout.id) ), // solo id de 1 a 4
                hydrationData,
                nutritionPreferencesData,
                vegetablesAndFruitsData
            },
            proPlanPt2: {
                activeData,
                workoutWeeks: workoutWeeks.filter((workout: any) => idsPlan2.includes(workout.id) ), // solo id de 5 a 8
                cardiovascularLevels,
            },
            allergiesForm:{
                allergiesData,
                intolerancesData,
                nutritionPreferencesData,
            },
            weeklyFeedbackQuiz:{

            }
        };
    }


    @Post('setInitialAnswers')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Set Initial questions answers to user' })
    @ApiBody({ type: SetInitialAnswersDto })
    @ApiResponse({ status: 201, description: 'User updated successfully.' })
    @ApiResponse({ status: 400, description: 'Validation errors.' })

    async setInitialAnswers(@Body() setInitialAnswersDto: SetInitialAnswersDto, @Req() req:any): Promise<User> {
        return this.planService.setInitialAnswers(setInitialAnswersDto, req.user.id);
    }

    @Post('setBasicActivityPlanAnswers')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Set Basic plan activity questions answers to user' })
    @ApiBody({ type: SetBasicActivityPlanAnswersDto })
    @ApiResponse({ status: 201, description: 'User updated successfully.' })
    @ApiResponse({ status: 400, description: 'Validation errors.' })

    async setBasicActivityPlanAnswers(@Body() setBasicActivityPlanAnswersDto: SetBasicActivityPlanAnswersDto, @Req() req:any): Promise<User> {
        return this.planService.setBasicActivityAnswers(setBasicActivityPlanAnswersDto, req.user.id);
    }

    @Post('setProActivityAnswers')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Set Pro plan activity questions answers to user' })
    @ApiBody({ type: SetProActivityPlanAnswersDto })
    @ApiResponse({ status: 201, description: 'User updated successfully.' })
    @ApiResponse({ status: 400, description: 'Validation errors.' })

    async setProActivityAnswers(@Body() setProActivityPlanAnswersDto: SetProActivityPlanAnswersDto, @Req() req:any): Promise<User> {
        return this.planService.setProActivityAnswers(setProActivityPlanAnswersDto, req.user.id);
    }

    @Post('setProAllergyPlanAnswers')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Set Pro plan allergy questions answers to user' })
    @ApiBody({ type: SetProAllergyPlanAnswersDto })
    @ApiResponse({ status: 201, description: 'User updated successfully.' })
    @ApiResponse({ status: 400, description: 'Validation errors.' })

    async setProAllergyPlanAnswers(@Body() setProAllergyPlanAnswersDto: SetProAllergyPlanAnswersDto, @Req() req:any): Promise<User> {
        return this.planService.setProAllergyPlanAnswers(setProAllergyPlanAnswersDto, req.user.id);
    }

    @Get('getActivityProgress')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get User data for Activity home page' })
    @ApiResponse({ status: 201, description: 'User updated successfully.' })
    @ApiResponse({ status: 400, description: 'Validation errors.' })

    async getActivityProgress(@Body('daily') daily: string, @Req() req:any): Promise<any> {
        return this.planService.getActivityProgress(req.user.id, daily === 'true');
    }


}
