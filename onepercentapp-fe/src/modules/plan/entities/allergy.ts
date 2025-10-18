import {
    Column,
    CreateDateColumn,
    Entity, ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Ingredient} from "../../ingredient/entities/ingredient.entity";
import {User} from "../../user/entities/user.entity";

@Entity()
export class Allergy {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({nullable: true})
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    /**
     * Relationships -----------------------------------------------------------
     */

    @ManyToMany(() => Ingredient, (ingredient) => ingredient.allergies)
    ingredients: Ingredient[];

    @ManyToMany(() => User, user => user.allergies)
    users: User[];

}