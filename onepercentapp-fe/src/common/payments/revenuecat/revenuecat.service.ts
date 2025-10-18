import {Injectable, Logger, NotFoundException} from '@nestjs/common';
import {HttpModule, HttpService} from '@nestjs/axios';
import {UserLicenseService} from "../../../modules/user-license/user-license.service";
import {firstValueFrom} from "rxjs";


@Injectable()
export class RevenuecatService {

    private REVENUECAT_SECRET = process.env.REVENUECAT_SECRET;
    private BASE_URL = 'https://api.revenuecat.com/v2';
    private PROJECT_ID = process.env.REVENUECAT_PROJECTID;

    private logger = new Logger(RevenuecatService.name);

    constructor(
        private readonly userLicenseService: UserLicenseService,
        private readonly httpService: HttpService
    ){
        this.logger.log("RevenuecatService initialized with params :", this.REVENUECAT_SECRET, this.BASE_URL);
    }

    prepareHeaders(){
        return {
            headers: {
                Authorization: `Bearer ${this.REVENUECAT_SECRET}`,
                'Content-Type': 'application/json',
            },
        };
    }

    async getSubscriber(userId: number) {
        try {
            console.log("Checking user in RevenueCat:", userId);
            const res = await firstValueFrom(
                this.httpService.get(`${this.BASE_URL}/subscribers/${userId}`,
                this.prepareHeaders())
            );
            console.log("Data: ", res.data);
            return res.data;
        } catch (err: any) {
            console.error('Error consultando usuario en RevenueCat:', err.response?.data || err.message);
            throw err;
        }
    }

    async checkRevenueCatSubscription(subscriptionId: number) {
        try {
            console.log("Checking subscription in Revenuecat for subscription:", subscriptionId, `${this.BASE_URL}/projects/${this.PROJECT_ID}/subscriptions/${subscriptionId}`);

            const response = await firstValueFrom(
                this.httpService.get(
                `${this.BASE_URL}/projects/${this.PROJECT_ID}/subscriptions/${subscriptionId}`,
                this.prepareHeaders())
            );
            console.log("Data: ", response.data);
            return response.data.status == 'active';
        }catch(err) {
            return false;
        }
    }

    async getRevenueCatSubscriptionsFromUserID(userId: number) {
        const url = `${this.BASE_URL}/projects/${this.PROJECT_ID}/customers/${userId}/subscriptions`;
        this.logger.log("Checking subscriptions in Revenuecat for user ID:", userId, `${url}`);
        // this.logger.debug("Headers: ", this.prepareHeaders());
        // const response = await axios.get(url, this.prepareHeaders());
        const response = await firstValueFrom(
            this.httpService.get(url, this.prepareHeaders())
        );
        this.logger.debug(" REVENUECAT RESPONSE: ", response);

        const data = response.data;

        if (!data || !data.items || data.items.length <= 0) {
            throw new NotFoundException("No subscriptions found for user ID: " + userId);
        }

        return data.items.map((item: any) => {
            return {
                id: item.id,
                environment: item.environment,
                productId: item.product_id,
                startsAt: item.starts_at,
                store: item.store,
                status: item.status,
                store_subscription_identifier: item.store_subscription_identifier,
                pending_payment: item.pending_payment
            };
        })
    }

    async checkRevenueCatSubscriptionFromUser(userId: number) {
        try {
            const userLicense = await this.userLicenseService.findActiveLicenseOfUser(userId);
            if (!userLicense || !userLicense.subscriptionId) {
                console.log("User not found or not subscription ID present");
                return false;
            }
            return await this.checkRevenueCatSubscription(Number(userLicense.subscriptionId));

        }catch(err) {
            return false;
        }
    }

    async cancelRevenueCatSubscription(subscriptionId: number) {
        try {
            console.log("Canceling subscription in Revenuecat for subscription:", subscriptionId, `${this.BASE_URL}/projects/${this.PROJECT_ID}/subscriptions/${subscriptionId}/actions/cancel`);

            const response = await firstValueFrom(
                this.httpService.get(
                `${this.BASE_URL}/projects/${this.PROJECT_ID}/subscriptions/${subscriptionId}/actions/cancel`,
                this.prepareHeaders())
            );
            console.log("Data: ", response.data);

        }catch(err) {
            return false;
        }
    }
}
