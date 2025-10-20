import {BadRequestException, forwardRef, Inject, Injectable, Logger, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import {CreateUserDto} from "./dto/createUser.dto";
import { validate } from 'class-validator';
import {MailService} from "../../common/mail/mail.service";
import {EmailValidation} from "../auth/entities/email-validation.entity";
import {randomBytes} from "crypto";
import {BaseService} from "../../common/services/base.service";
import { v4 as uuidv4 } from 'uuid';
import {LicenseService} from "../license/license.service";
import {UserToken} from "./entities/userToken.entity";
import {RecipeService} from "../recipe/recipe.service";
import { SearchUserDto } from './dto/searchUser.dto';
import { License } from '../license/entities/license.entity';
import { UserLicense } from '../user-license/entities/user-license.entity';

@Injectable()
export class UserService extends BaseService<User>{
    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(EmailValidation)
        private readonly emailValidationRepository: Repository<EmailValidation>,
        @InjectRepository(UserToken)
        private readonly userTokenRepository: Repository<UserToken>,
        private readonly mailService: MailService,
        @Inject(forwardRef(() => LicenseService))
        private readonly licenseService: LicenseService,
        private readonly recipeService: RecipeService
    ) {
        super(userRepository);
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find({ relations: ['role'] });
    }

    async findById(userId: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: {id: userId}, relations: ['role', 'userLicenses', 'userLicenses.license', 'favouriteRecipes', 'activeData', 'workoutWeek', 'hydrationDay', 'lunchDay', 'vegetablesAndFruits', 'cardiovascularLevel', 'target', 'gender', 'province', 'referral', 'allergies', 'intolerances', 'nutritionPreferences'] });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { email }, relations: ['role'] });
    }

    async findOneByRefreshToken(refreshToken: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { refreshToken }, relations: ['role'] });
    }

    async create(userData: Partial<User>): Promise<User> {
        userData.uuid = uuidv4();
        let user = await this.userRepository.save(userData);
        // Encrypt password before save
        user.password = await this.hashPassword(user.password);
        user = await this.userRepository.save(user);

        // Auto-validate email in development
        if (process.env.NODE_ENV === 'development') {
            user.validatedEmail = new Date();
            user = await this.userRepository.save(user);
        } else {
            // Send account validation email
            let accountValidationToken = randomBytes(20).toString('hex');
            await this.emailValidationRepository.save({
              token: accountValidationToken,
              email: user.email,
            });

            // Send validation email
            this.mailService.sendAccountValidation(user, accountValidationToken);
        }

        // Basic user license creation
        await this.licenseService.setBasicLicense(user.id);

        return await this.findById(user.id);
    }

    async update(userId: number, userData: Partial<User>): Promise<User> {
        // Avoid updating password
        // delete userData.password;
        await this.userRepository.update(userId,userData);
        // await this.userRepository.save(userData);
        return await this.findById(userId);
    }

    async save(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    async delete(userId: number): Promise<void> {
        const user = await this.findById(userId);
        if (!user){
            throw new NotFoundException('User not found');
        }
        // Delete relationships
        // ...

        await this.userRepository.delete(userId);
    }

    async getMyFavoriteRecipes(userId: number){
        const user = await this.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user.favouriteRecipes;
    }

    async setFavouriteRecipe(userId: number, recipeId: number): Promise<User>{
        const user = await this.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const recipe = await this.recipeService.findById(recipeId);
        if (!recipe) {
            throw new NotFoundException('Recipe not found');
        }

        if (!user.favouriteRecipes) {
            user.favouriteRecipes = [];
        }

        // Check if recipe is already in favourites
        if (user.favouriteRecipes.some(recipe => recipe.id === recipeId)) {
            throw new BadRequestException('Recipe is already in favourites');
        }

        user.favouriteRecipes.push(recipe); // Assuming recipe is a simple object with an id
        return await this.userRepository.save(user);
    }

    async deleteFavouriteRecipe(userId: number, recipeId: number): Promise<User>{
        const user = await this.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const recipe = await this.recipeService.findById(recipeId);
        if (!recipe) {
            throw new NotFoundException('Recipe not found');
        }

        if (!user.favouriteRecipes) {
            // throw new BadRequestException('No favourite recipes found');
            return user; // No favourites to delete, return user as is
        }

        // Check if recipe is in favourites
        console.log("favorite recipes:", user.favouriteRecipes);
        const favouriteRecipe = user.favouriteRecipes.find((r: any) => r.id === Number(recipeId));
        // Delete recipe from favourites
        if (!favouriteRecipe) {
            throw new BadRequestException('Recipe is not in favourites');
        }
        user.favouriteRecipes = user.favouriteRecipes.filter((r: any) => r.id !== Number(recipeId));
        return await this.userRepository.save(user);
    }

    async searchFilteredUsers(filters: SearchUserDto = {} as SearchUserDto): Promise<User[]> {
        const { searchString, plan } = filters;
        const query = this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.userLicenses', 'userLicense', 'userLicense.active = true')
            .leftJoinAndSelect('userLicense.license', 'license');

        if (searchString) {
            query.andWhere(
                '(user.firstname LIKE :search OR user.lastname LIKE :search OR user.email LIKE :search)',
                { search: `%${searchString}%` }
            );
        }
        if (plan) {
            let planIds: number[] = [];
            if (plan.toLowerCase() === 'premium') {
                planIds = [1, 2, 3];
            } else if (plan.toLowerCase() === 'basic' || plan.toLowerCase() === 'básico') {
                planIds = [4];
            }
            if (planIds.length > 0) {
                query.andWhere('license.id IN (:...planIds)', { planIds });
            }
        }
        return query.getMany();
    }

    /**
     * Helper methods
     */

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async comparePasswords(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}