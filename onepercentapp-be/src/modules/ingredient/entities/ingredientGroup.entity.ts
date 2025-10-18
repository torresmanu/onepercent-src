import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Recipe} from "../../recipe/entities/recipe.entity";
import {RecipeIngredient} from "../../recipe/entities/recipeIngredient.entity";
import {Ingredient} from "./ingredient.entity";

@Entity()
export class IngredientGroup {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    /**
     * Relationships -----------------------------------------------------------
     */

    // Ingredient could be used by N recipes
    @OneToMany(() => Ingredient, (i) => i.ingredientGroup)
    ingredients: Ingredient[];


}