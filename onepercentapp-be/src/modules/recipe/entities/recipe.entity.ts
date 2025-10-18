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
import {UserToken} from "../../user/entities/userToken.entity";
import {RecipeStep} from "./recipeStep.entity";
import {RecipeMomentOfDay} from "./recipeMomentOfDay.entity";
import {RecipeDietType} from "./recipeDietType.entity";
import {RecipeNutritionalInfo} from "./recipeNutritionalInfo.entity";
import {Role} from "../../user/entities/role.entity";
import {RecipeIngredient} from "./recipeIngredient.entity";
import {RecipeAllergen} from "../../recipe-allergen/dto/recipe-allergen.entity";

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ })
    timeOfPreparation: number;

    @Column({ })
    kcal: number;

    @Column({ })
    nutritionalQuality: number;

    @Column({ default: false })
    isPremium: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    /**
     * Relationships -----------------------------------------------------------
     */
//     M-N with Ingredient
    @OneToMany(() => RecipeIngredient, (ri) => ri.recipe, { cascade: true })
    recipeIngredients: RecipeIngredient[];

    @OneToMany(() => RecipeStep, (recipeStep) => recipeStep.recipe)
    recipeSteps: RecipeStep[];

    @OneToMany(() => RecipeMomentOfDay, (recipeMomentOfDay) => recipeMomentOfDay.recipe)
    recipeMomentsOfDay: RecipeMomentOfDay[];

    @OneToMany(() => RecipeDietType, (recipeDietType) => recipeDietType.recipe)
    recipeDietTypes: RecipeDietType[];

    @OneToMany(() => RecipeAllergen, (recipeAllergen) => recipeAllergen.recipe)
    recipeAllergens: RecipeAllergen[];

    @OneToMany(() => RecipeNutritionalInfo, (recipeNutritionalInfo) => recipeNutritionalInfo.recipe)
    recipeNutritionalInfos: RecipeNutritionalInfo[];

    // N-M with User as Favourite Receipes
    @ManyToMany(() => User, user => user.favouriteRecipes)
    favouritedByUsers: User[];

//     1-N with User (creator)
    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;


}