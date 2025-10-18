import {forwardRef, Module} from '@nestjs/common';
import { ProfileService } from './profile.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {UserToken} from "../user/entities/userToken.entity";
import {Role} from "../user/entities/role.entity";
import {AuthModule} from "../auth/auth.module";
import {UserService} from "../user/user.service";
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {IsInDatabaseConstraint} from "../../common/constraints/IsInDatabaseConstraint";
import {IsEmailUniqueConstraint} from "../../common/constraints/IsEmailUniqueConstraint";
import {ProfileController} from "./profile.controller";
import {UserModule} from "../user/user.module";
import {StorageService} from "../../common/storage/storage.service";
import {NominatimService} from "../../common/geolocation/nominatim.service";
import {RestService} from "../../common/net/rest.service";
import {MailService} from "../../common/mail/mail.service";
import {ResetPasswordService} from "../reset-password/reset-password.service";
import {ResetPasswordModule} from "../reset-password/reset-password.module";
import {ResetPassword} from "../reset-password/entities/reset-password.entity";
import {EmailValidation} from "../auth/entities/email-validation.entity";
import {LicenseService} from "../license/license.service";
import {License} from "../license/entities/license.entity";
import {UserLicense} from "../user-license/entities/user-license.entity";
import {RevenuecatService} from "../../common/payments/revenuecat/revenuecat.service";
import {UserLicenseService} from "../user-license/user-license.service";
import {HttpModule} from "@nestjs/axios";
import {BusinessModule} from "../business.module";

@Module({
    imports: [
      TypeOrmModule.forFeature([User, UserToken, Role, ResetPassword, EmailValidation, License, UserLicense]),
      // forwardRef(() => AuthModule),
      // forwardRef(() => UserModule),
      // forwardRef(() => ResetPasswordModule),
      // forwardRef(() => HttpModule),
        forwardRef(() => BusinessModule),


    ],  // Usar forwardRef para evitar ciclos],
    providers: [ProfileService, UserService, JwtAuthGuard, IsInDatabaseConstraint, IsEmailUniqueConstraint, StorageService, NominatimService, RestService, MailService, ResetPasswordService, LicenseService, RevenuecatService, UserLicenseService],
    controllers: [ProfileController],
    exports: [ProfileService],
})
export class ProfileModule {}
