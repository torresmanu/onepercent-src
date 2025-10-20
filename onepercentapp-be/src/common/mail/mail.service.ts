import { Injectable } from '@nestjs/common';
import {User} from "../../modules/user/entities/user.entity";
import { randomBytes } from 'crypto';
import {MailerService} from "@nestjs-modules/mailer";
import {ResetPasswordService} from "../../modules/reset-password/reset-password.service";

@Injectable()
export class MailService {

    constructor(
        private mailerService: MailerService,
        private resetPasswordService: ResetPasswordService
    ) {
    }

    async sendEmailResetPassword(user: User, platform: string, appScheme: string) {
        // Skip sending emails in development if MAIL_ENABLED is not explicitly 'true'
        if (process.env.MAIL_ENABLED !== 'true') {
        console.log('MAIL_ENABLED is not true - skipping reset password email in dev');
        return;
        }
        let resetPasswordToken = randomBytes(20).toString('hex');
        await this.resetPasswordService.create({ email: user.email, token: resetPasswordToken });
        console.log("Sending email of platform: " + platform);
        // let validationUrl = 'https://onepercentapp.com/' + 'reset-password/' + resetPasswordToken;
        let validationUrl = process.env.SERVER_ADDRESS + '/reset-password/getResetPage/' + resetPasswordToken;
        // if (platform === 'ios'){
        //    validationUrl = process.env.SERVER_ADDRESS + '/reset-password/' + resetPasswordToken;
        // }

        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Cambio de contraseña - onepercent',
            template: 'resetPassword',
            context: { // ✏️ filling curly brackets with content
                validationUrl,
                url: process.env.SERVER_ADDRESS,
                serverAddress: process.env.SERVER_ADDRESS,
            },
        });
    }

    async sendAccountValidation(user: User, token: string) {
        return await this.mailerService.sendMail({
            to: user.email,
            subject: 'Valida tu cuenta',
            template: 'accountValidation',
            context: { // ✏️ filling curly brackets with content
                validationUrl: process.env.SERVER_ADDRESS + '/auth/validate-account?token=' + token,
                url: process.env.SERVER_ADDRESS,
                serverAddress: process.env.SERVER_ADDRESS,
            },
        });
    }

    async sendNotification(template: any, to: any, subject: any, message: any, url: any, buttonHref: any, user?: any, payload?: any) {
        await this.mailerService.sendMail({
            to,
            subject,
            template,
            context: { // ✏️ filling curly brackets with content
                serverAddress: process.env.SERVER_ADDRESS,
                subject,
                message,
                url,
                buttonHref,
                userId: (user) ? user.id : '',
                fullname: (user) ? user.firstname + ' ' + user.lastname1 + ' ' + user.lastname2 : '',
                payload,
            },
        });
    }


    // async sendNotificationWithAttachment(template: any, to: any, subject: any, message: any, attachmentPath?: any) {
    //     await this.setTransport();
    //     try {
    //         const mail = {
    //             from: this.from,
    //             to,
    //             subject,
    //             template: template,
    //             context: {
    //                 serverAddress: process.env.SERVER_ADDRESS,
    //                 subject,
    //                 message
    //             },
    //             attachments: (attachmentPath) ? [
    //                 {
    //                     path: attachmentPath
    //                 },
    //             ] : []
    //         };
    //
    //         await this.transport.sendMail(mail);
    //     } catch (error) {
    //         console.log(error);
    //         throw new APIException(422, 'Error sending User notification:' + JSON.stringify(error));
    //     }
    // }
}
