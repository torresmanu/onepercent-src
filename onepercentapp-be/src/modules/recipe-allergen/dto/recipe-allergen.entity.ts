import {
    Column,
    CreateDateColumn,
    Entity, JoinTable,
    ManyToMany, ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Recipe} from "../../recipe/entities/recipe.entity";

@Entity()
export class RecipeAllergen {
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

//     1-N with Recipe
    @ManyToOne(() => Recipe, (recipe) => recipe.recipeAllergens, { onDelete: 'CASCADE' })
    recipe: Recipe;



}