import { Injectable } from '@nestjs/common';
import {BaseService} from "../../common/services/base.service";
import {RecipeAllergen} from "./dto/recipe-allergen.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class RecipeAllergenService extends BaseService<RecipeAllergen>{
    constructor(
        @InjectRepository(RecipeAllergen)
        private readonly recipeAllergenRepository: Repository<RecipeAllergen>,
    ) {
        super(recipeAllergenRepository);
    }
}
