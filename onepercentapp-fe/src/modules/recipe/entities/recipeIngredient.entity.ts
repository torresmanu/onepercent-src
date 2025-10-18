import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn, JoinTable,
    ManyToMany, ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Ingredient} from "../../ingredient/entities/ingredient.entity";
import {User} from "../../user/entities/user.entity";
import {Recipe} from "./recipe.entity";

@Entity()
export class RecipeIngredient {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number; // Ej: 200

    @Column({default: 'g'})
    unit: string; // Ej: "g", "ml", "cups", etc.


    /**
     * Relationships -----------------------------------------------------------
     */

    @ManyToOne(() => Recipe, recipe => recipe.recipeIngredients, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'recipeId' })
    recipe: Recipe;

    @ManyToOne(() => Ingredient, ingredient => ingredient.recipeIngredients, { eager: true })
    @JoinColumn({ name: 'ingredientId' })
    ingredient: Ingredient;



}