import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import {MailerModule} from "@nestjs-modules/mailer";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from 'path';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserToken} from "../../modules/user/entities/userToken.entity";
import {User} from "../../modules/user/entities/user.entity";
import {ResetPassword} from "../../modules/reset-password/entities/reset-password.entity";
import {ResetPasswordService} from "../../modules/reset-password/reset-password.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserToken, User, ResetPassword]),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD
        },
        debug: true,
        tls: {
          rejectUnauthorized: false
        }
      },
      defaults: {
        from: process.env.SMTP_FROM,
      },
      template: {
        dir: join(__dirname, '../../templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService, ResetPasswordService]
})
export class MailModule {}
