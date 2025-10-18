import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {BaseService} from "../../common/services/base.service";
import {License} from "./entities/license.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {RevenuecatService} from "../../common/payments/revenuecat/revenuecat.service";
import {User} from "../user/entities/user.entity";
import {UserService} from "../user/user.service";
import {from} from "rxjs";
import {APIException} from "../../common/exceptions/APIException";
import {BadRequestException, Logger, NotFoundException} from "@nestjs/common";
import {UserLicenseService} from "../user-license/user-license.service";
import {UserLicense} from "../user-license/entities/user-license.entity";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LicenseService extends BaseService<License>{
    private readonly logger = new Logger(LicenseService.name);

    constructor(
        // Inject the License entity repository
        @InjectRepository(License)
        private readonly licenseRepository: Repository<License>,
        private readonly revenuecatService: RevenuecatService,
        // Avoid circular dependecies with forwardRef inject userService
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly userLicenseService: UserLicenseService
    ) {
        super(licenseRepository);
    }

    async findByTitle(title: string): Promise<License | null> {
        const license = await this.licenseRepository.findOne({ where: { title } });
        if (!license) {
            this.logger.error(`License with title ${title} not found`);
            throw new NotFoundException("License not found");
        }
        return license;
    }

    // Additional methods specific to License

    async getActiveLicense(userId: number){
        const user = await this.userService.findById(userId);
        if (!user) {
            this.logger.error(`User with ID ${userId} not found`);
            throw new NotFoundException("User not found");
        }
        return user.userLicenses ? user.userLicenses.filter((ul: UserLicense) => ul.active) : [];
    }

    async setAdminLicense(userId: number, licenseId: number, subscriptionId?: string) {
        const user = await this.userService.findById(userId);
        if (!user) {
            this.logger.error(`User with ID ${userId} not found`);
            throw new NotFoundException("User not found");
        }
        const license = await this.findById(licenseId);
        if (!license) {
            throw new NotFoundException("License not found");
        }

        // Se marcan todos los planes como inactivos
        await this.userLicenseService.setAllOldLicensesInactive(userId);

        // Se crea el nuevo plan para el usuario
        return this.userLicenseService.createRaw({ user: {id: userId}, license, active: true, subscriptionId });
    }

    async setBasicLicense(userId: number) {
        let user: any = await this.userService.findById(userId);
        const activeLicenses = user.userLicenses ? user.userLicenses.filter((ul: UserLicense) => ul.active) : [];
        if (!user){
            throw new NotFoundException("User with active license not found. Please check the user ID.");
        }
        // this.logger.debug("User active licenses", activeLicenses);
        const basicLicense = await this.findByTitle('basic');
        // Set basic license
        if (basicLicense){
            if (!activeLicenses || activeLicenses.length <= 0) {
                return this.userLicenseService.createRaw({ user: {id: userId}, license: basicLicense, active: true });
            }
            else if (Number(activeLicenses[0].license.id) !== Number(basicLicense.id)) {
                // Se marcan todos los planes como inactivos
                await this.userLicenseService.setAllOldLicensesInactive(userId);
                // Create new basic license
                return this.userLicenseService.createRaw({ user: {id: userId}, license: basicLicense, active: true });
            }else{
                return activeLicenses[0]; // Return the existing basic license if it is already active
            }
        }else{
            throw new NotFoundException("Basic license not found. Please check the database.");
        }
    }

    /**
     * Revenuecat version for setLicense
     * @param userId
     * @param licenseId
     */
    async setLicense(userId: number, licenseId: number) {
        console.log(`Setting license ${licenseId} for user ${userId}.`);
        // Check license and activate it
        let {user, errors} = await this.checkUserLicense(userId);

        // Get License requested

        const userLicenses = await this.userLicenseService.find({ user: { id: userId }, active: true}, ['user', 'license']);
        if (!userLicenses || userLicenses.length <= 0) {
            throw new NotFoundException("User with active license not found. Please check the user ID.");
        }
        if (userLicenses.length > 1) {
            throw new BadRequestException("User has more than one active license. Please contact support.");
        }
        user = await this.userService.findById(userId);
        return {user, errors};
    }

    /**
     * Revenuecat version for checkUserLicense
     * @param userId
     */
    async checkUserLicense(userId: number) {
        // Check if user has a valid license
        this.logger.debug("Checking user licenses for user ID:", userId);
        const errors: any = [];
        let premium = false;

        let user: any = await this.userService.find({ id: userId },['userLicenses', 'userLicenses.license']);
        // this.logger.debug("User found: ", user);
        if (!user){
            throw new NotFoundException("User with active license not found. Please check the user ID.");
        }

        if (!user.uuid) {
            this.logger.debug(`User with ID ${userId} UUID not found`);
            user = await this.userService.update(userId, { uuid: uuidv4() });
        }

        // Check if user has a valid license
        let subscriptions: any;
        try {
            this.logger.debug('Getting subscriptions from Revenuecat for user ID: ' + user.uuid);
            subscriptions = await this.revenuecatService.getRevenueCatSubscriptionsFromUserID(user.uuid);
        }catch (error) {
            this.logger.error("Error getting subscriptions from Revenuecat: " + error.message);
            await this.setBasicLicense(userId);
            return {user: null, errors: "Error getting subscriptions from Revenuecat for user ID: " + user.uuid + ". Returning BASIC plan for user..."};
        }

        if (!subscriptions || subscriptions.length <= 0) {
            this.logger.log("User has no valid subscriptions. Creating Basic license...");
            await this.setBasicLicense(userId);
        }else {
            this.logger.log("User has subscriptions: ", subscriptions);
            for (const subscription of subscriptions) {
                if (subscription.status == 'active' && subscription.productId && subscription.store) {
                    // Get product of subscription
                    let license;
                    if (subscription.store == 'app_store') {
                        // Apple
                        license = await this.find({appleProductId: subscription.productId}, []);
                        if (!license) {
                            errors.push("Product with ID " + subscription.productId + " not found on database. User has purchased products on Apple Store that has not been registered on the database.");
                        }
                    } else {
                        // Google
                        license = await this.find({googleProductId: subscription.productId}, []);
                        if (!license) {
                            errors.push("Product with ID " + subscription.productId + " not found on database. User has purchased products on Google Store that has not been registered on the database.");
                        }
                    }

                    if (license) {
                        // Mark all licenses as inactive
                        await this.userLicenseService.setAllOldLicensesInactive(userId);

                        // Create new basic license
                        const userLicense = await this.userLicenseService.findOrCreate(
                            { user: { id: user.id }, license: { id: license.id } }, // where
                            {
                                user,
                                license,
                                active: true,
                                subscriptionId: subscription.id,
                            }
                        );

                        // Set new license as active
                        await this.userLicenseService.update(userLicense.id, {subscriptionId: subscription.id, active: true});

                        premium = true;
                    }
                }
            }

            if (!premium) {
                await this.setBasicLicense(userId);
            }
        }

        user = await this.userService.findById(userId);
        return {user, errors};
    }

    /**
     * Revenuecat version for cancelUserLicenseAtPeriodEnd
     * @param userId
     */
    async cancelUserLicenseAtPeriodEnd(userId: number) {
        // Get the user license
        const userLicenses = await this.userLicenseService.find({ user: { id: userId }, active: true}, ['user', 'license']);
        if (!userLicenses || userLicenses.length <= 0) {
            throw new NotFoundException("User with active license not found. Please check the user ID.");
        }
        if (userLicenses.length > 1) {
            throw new BadRequestException("User has more than one active license. Please contact support.");
        }
        if (!userLicenses[0].subscriptionId){
            throw new BadRequestException("User has no subscription ID. Please contact support.");
        }
        // Cancel the subscription
        await this.revenuecatService.cancelRevenueCatSubscription(Number(userLicenses[0].subscriptionId));

        return userLicenses[0];
    }

}
