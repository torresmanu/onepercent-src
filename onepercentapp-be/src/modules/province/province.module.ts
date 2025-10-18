import {forwardRef, Module} from '@nestjs/common';
import { ProvinceController } from './province.controller';
import { ProvinceService } from './province.service';
import {BusinessModule} from "../business.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Province} from "./entities/province.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Province]),
    forwardRef(() => BusinessModule),

  ],
  controllers: [ProvinceController],
  providers: [ProvinceService],
  exports: [ProvinceService],
})
export class ProvinceModule {}
