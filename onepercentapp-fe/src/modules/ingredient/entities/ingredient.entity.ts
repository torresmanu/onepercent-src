import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn, JoinTable,
    ManyToMany, ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {RecipeIngredient} from "../../recipe/entities/recipeIngredient.entity";
import {IngredientGroup} from "./ingredientGroup.entity";
import {Allergy} from "../../plan/entities/allergy";

@Entity()
export class Ingredient {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    name: string;

    @Column()
    name_en: string;

    @Column({nullable: true})
    energy: number;

    @Column({nullable: true})
    protein: number;

    @Column({nullable: true})
    carbs: number;

    @Column({nullable: true})
    fat: number;

    @Column({nullable: true})
    nonSaturatedFat: number;

    @Column({nullable: true})
    saturatedFat: number;

    @Column({nullable: true})
    sugar: number;

    @Column({nullable: true})
    fiber: number;

    @Column({nullable: true})
    cholesterol: number;

    @Column({nullable: true})
    potassium: number;

    @Column({nullable: true})
    sodium: number;

    @Column({nullable: true})
    salt: number;

    @Column({default: true})
    fresh: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    /**
     * Relationships -----------------------------------------------------------
     */

    // Ingredient could be used by N recipes
    @OneToMany(() => RecipeIngredient, (ri) => ri.ingredient)
    recipeIngredients: RecipeIngredient[];

    @ManyToOne(() => IngredientGroup, ingredientGroup => ingredientGroup.ingredients, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ingredientGroupId' })
    ingredientGroup: IngredientGroup;
    @Column({ nullable: true })
    ingredientGroupId: number;

    @ManyToMany(() => Allergy, (allergy) => allergy.ingredients)
    @JoinTable({name: 'ingredient_allergies',}) // Se define solo en este lado
    allergies: Allergy[];


}