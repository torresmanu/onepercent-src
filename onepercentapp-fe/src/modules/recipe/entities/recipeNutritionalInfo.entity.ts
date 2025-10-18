import {
    Column,
    CreateDateColumn,
    Entity, JoinTable,
    ManyToMany, ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Ingredient} from "../../ingredient/entities/ingredient.entity";
import {User} from "../../user/entities/user.entity";
import {Recipe} from "./recipe.entity";

@Entity()
export class RecipeNutritionalInfo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    value: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    /**
     * Relationships -----------------------------------------------------------
     */

//     1-N with Recipe
    @ManyToOne(() => Recipe, (recipe) => recipe.recipeNutritionalInfos, { onDelete: 'CASCADE' })
    recipe: Recipe;



}