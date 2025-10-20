import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "../../user/entities/user.entity";
import {UserMealIngredient} from "./user-meal-ingredient.entity";

@Entity()
export class UserMeal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    mealType: string; // 'desayuno', 'comida', 'cena', 'snack'

    @Column({ type: 'date' })
    date: string;

    @Column({ type: 'float', default: 0 })
    totalKcal: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    //     Relationships --------------------------------------------------

    @ManyToOne(() => User, (user) => user.userMeals, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
    @Column()
    userId: number;

    @OneToMany(() => UserMealIngredient, (umi) => umi.userMeal, { cascade: true, eager: true })
    ingredients: UserMealIngredient[];
}

