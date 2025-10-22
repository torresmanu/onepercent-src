import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './database/database.module';
import {SeederService} from "./database/seeder.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Role} from "./modules/user/entities/role.entity";
import {User} from "./modules/user/entities/user.entity";
import { BackofficeModule } from './modules/backoffice/backoffice.module';
import { ProfileController } from './modules/profile/profile.controller';
import { ProfileModule } from './modules/profile/profile.module';
import {UserToken} from "./modules/user/entities/userToken.entity";
import {StorageService} from "./common/storage/storage.service";
import {NominatimService} from "./common/geolocation/nominatim.service";
import {RestService} from "./common/net/rest.service";
import {MailService} from "./common/mail/mail.service";
import { MailModule } from './common/mail/mail.module';
import { ResetPasswordModule } from './modules/reset-password/reset-password.module';
import { CapsuleModule } from './modules/capsule/capsule.module';
import { ActivityCategoryModule } from './modules/activity-category/activity-category.module';
import { ActivityMaterialModule } from './modules/activity-material/activity-material.module';
import { ActivityTypeModule } from './modules/activity-type/activity-type.module';
import { ActivityIntensityModule } from './modules/activity-intensity/activity-intensity.module';
import {join} from "path";
import {ServeStaticModule} from "@nestjs/serve-static";
import { RevenuecatModule } from './common/payments/revenuecat/revenuecat.module';
import { UserLicenseModule } from './modules/user-license/user-license.module';
import { LicenseModule } from './modules/license/license.module';
import { TargetModule } from './modules/target/target.module';
import { UserPointModule } from './modules/user-point/user-point.module';
import { PlanModule } from './modules/plan/plan.module';
import { ProvinceModule } from './modules/province/province.module';
import { BusinessModule } from './modules/business.module';
import { UserMealModule } from './modules/user-meal/user-meal.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, User, UserToken]),
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables estén disponibles en toda la app
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Carpeta pública
      serveRoot: '/public', // Prefijo de URL (opcional)
    },
    {
      rootPath: join(__dirname, '..', '.well-known'), // Carpeta pública
      serveRoot: '/.well-known', // Prefijo de URL (opcional)
    }),
    AuthModule,
    UserModule,
    DatabaseModule,
    BackofficeModule,
    ProfileModule,
    MailModule,
    ResetPasswordModule,
    CapsuleModule,
    ActivityCategoryModule,
    ActivityMaterialModule,
    ActivityTypeModule,
    ActivityIntensityModule,
    RevenuecatModule,
    UserLicenseModule,
    LicenseModule,
    TargetModule,
    UserPointModule,
    PlanModule,
    ProvinceModule,
    BusinessModule,
    UserMealModule,
  ],
  controllers: [AppController, ProfileController],
  providers: [AppService, SeederService, StorageService, NominatimService, RestService, MailService],
})
export class AppModule {}
