import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserHydrationController } from './user-hydration.controller';
import { UserHydrationService } from './user-hydration.service';
import { UserHydration } from './entities/user-hydration.entity';
import { User } from '../user/entities/user.entity';
import { UserToken } from '../user/entities/userToken.entity';
import { BusinessModule } from '../business.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserHydration, User, UserToken]),
        forwardRef(() => BusinessModule),
    ],
    controllers: [UserHydrationController],
    providers: [UserHydrationService],
    exports: [UserHydrationService],
})
export class UserHydrationModule {}

