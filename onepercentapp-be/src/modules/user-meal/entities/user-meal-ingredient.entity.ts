import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {UserMeal} from "./user-meal.entity";
import {Ingredient} from "../../ingredient/entities/ingredient.entity";

@Entity()
export class UserMealIngredient {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'float' })
    quantity: number;

    @Column({ default: 'gramos' })
    unit: string;

    @Column({ type: 'float' })
    kcal: number;

    /**
     * Relationships -----------------------------------------------------------
     */

    @ManyToOne(() => UserMeal, userMeal => userMeal.ingredients, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userMealId' })
    userMeal: UserMeal;
    @Column()
    userMealId: number;

    @ManyToOne(() => Ingredient, { eager: true })
    @JoinColumn({ name: 'ingredientId' })
    ingredient: Ingredient;
    @Column()
    ingredientId: number;
}

