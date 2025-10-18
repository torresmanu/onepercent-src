import {Inject, Injectable} from '@nestjs/common';
import {BaseService} from "../../common/services/base.service";
import {Ingredient} from "./entities/ingredient.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import {IngredientGroup} from "./entities/ingredientGroup.entity";
import {async} from "rxjs";
import {Allergy} from "../plan/entities/allergy";

@Injectable()
export class IngredientService extends BaseService<Ingredient>{
    constructor(
        @InjectRepository(Ingredient)
        private readonly ingredientRepository: Repository<Ingredient>,
        @InjectRepository(IngredientGroup)
        private readonly ingredientGroupRepository: Repository<IngredientGroup>,
        @InjectRepository(Allergy)
        private readonly allergyRepository: Repository<Allergy>,
    ) {
        super(ingredientRepository);
    }

    async findByCode(code: string): Promise<Ingredient | null> {
        return this.ingredientRepository.findOne({ where: { code } });
    }

    async createIngredientGroup (id: number, name: string){
        return this.ingredientGroupRepository.save({id, name});
    }

    async findIngredientGroupsByIds (ids: number[]): Promise<IngredientGroup[]> {
        return await this.ingredientGroupRepository.find({
            where: { id: In([4, 5, 8]) },
        });
    }

    async findAllergensByIds (ids: number[]): Promise<Allergy[]> {
        return await this.allergyRepository.find({
            where: { id: In(ids) },
            select: ['id']
        });
    }


}
