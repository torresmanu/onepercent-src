import {forwardRef, Module} from '@nestjs/common';
import {UserModule} from "./user/user.module";
import {AuthModule} from "./auth/auth.module";
import {ActivityCategoryModule} from "./activity-category/activity-category.module";
import {ActivityIntensityModule} from "./activity-intensity/activity-intensity.module";
import {ActivityMaterialModule} from "./activity-material/activity-material.module";
import {ActivityTypeModule} from "./activity-type/activity-type.module";
import {BackofficeModule} from "./backoffice/backoffice.module";
import {CapsuleModule} from "./capsule/capsule.module";
import {LicenseModule} from "./license/license.module";
import {PlanModule} from "./plan/plan.module";
import {ProfileModule} from "./profile/profile.module";
import {ProvinceModule} from "./province/province.module";
import {ResetPasswordModule} from "./reset-password/reset-password.module";
import {TargetModule} from "./target/target.module";
import {UserLicenseModule} from "./user-license/user-license.module";
import {UserPointModule} from "./user-point/user-point.module";
import {JwtAuthGuard} from "../common/guards/jwt-auth.guard";
import {IsInDatabaseConstraint} from "../common/constraints/IsInDatabaseConstraint";
import {IsEmailUniqueConstraint} from "../common/constraints/IsEmailUniqueConstraint";
import {MailService} from "../common/mail/mail.service";
import {RevenuecatService} from "../common/payments/revenuecat/revenuecat.service";
import {HttpModule} from "@nestjs/axios";
import {StorageService} from "../common/storage/storage.service";
import {JwtModule} from "@nestjs/jwt";
import { IngredientModule } from './ingredient/ingredient.module';
import { RecipeModule } from './recipe/recipe.module';
import { RecipeAllergenModule } from './recipe-allergen/recipe-allergen.module';
import { UserActivityModule } from './user-activity/user-activity.module';

@Module({
    imports: [
        forwardRef(() => UserModule),
        forwardRef(() => AuthModule),
        forwardRef(() => ActivityCategoryModule),
        forwardRef(() => ActivityIntensityModule),
        forwardRef(() => ActivityMaterialModule),
        forwardRef(() => ActivityTypeModule),
        forwardRef(() => BackofficeModule),
        forwardRef(() => CapsuleModule),
        forwardRef(() => LicenseModule),
        forwardRef(() => PlanModule),
        forwardRef(() => ProfileModule),
        forwardRef(() => ProvinceModule),
        forwardRef(() => ResetPasswordModule),
        forwardRef(() => TargetModule),
        forwardRef(() => UserLicenseModule),
        forwardRef(() => UserPointModule),


        forwardRef(() => HttpModule),
        forwardRef(() => JwtModule),
        forwardRef(() => IngredientModule),
        forwardRef(() => RecipeModule),
        forwardRef(() => RecipeAllergenModule),
        forwardRef(() => UserActivityModule),

    ],
    providers: [
        // JwtAuthGuard,
        IsInDatabaseConstraint,
        IsEmailUniqueConstraint,
        MailService,
        RevenuecatService,
        StorageService
    ],
    exports: [
        forwardRef(() => UserModule),
        forwardRef(() => AuthModule),
        forwardRef(() => ActivityCategoryModule),
        forwardRef(() => ActivityIntensityModule),
        forwardRef(() => ActivityMaterialModule),
        forwardRef(() => ActivityTypeModule),
        forwardRef(() => BackofficeModule),
        forwardRef(() => CapsuleModule),
        forwardRef(() => LicenseModule),
        forwardRef(() => PlanModule),
        forwardRef(() => ProfileModule),
        forwardRef(() => ProvinceModule),
        forwardRef(() => ResetPasswordModule),
        forwardRef(() => TargetModule),
        forwardRef(() => UserLicenseModule),
        forwardRef(() => UserPointModule),

        forwardRef(() => HttpModule),
        forwardRef(() => JwtModule),
        forwardRef(() => IngredientModule),
        forwardRef(() => RecipeModule),
        forwardRef(() => RecipeAllergenModule),
        forwardRef(() => UserActivityModule),

        // JwtAuthGuard,
        IsInDatabaseConstraint,
        IsEmailUniqueConstraint,
        MailService,
        RevenuecatService,
        StorageService
    ]
})
export class BusinessModule {}
