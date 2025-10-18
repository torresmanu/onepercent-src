import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    JoinColumn,
    ManyToOne,
    UpdateDateColumn,
    CreateDateColumn, Point, JoinTable, ManyToMany
} from 'typeorm';
import { UserToken } from './userToken.entity';
import {Role} from "./role.entity";
import {UserLicense} from "../../user-license/entities/user-license.entity";
import {UserPoint} from "../../user-point/entities/user-point.entity";
import {Province} from "../../province/entities/province.entity";
import {Recipe} from "../../recipe/entities/recipe.entity";
import {Gender} from "../../plan/entities/gender.entity";
import {Referral} from "../../plan/entities/referral.entity";
import {ActiveData} from "../../plan/entities/activeData.entity";
import {WorkoutWeek} from "../../plan/entities/workoutWeek.entity";
import {CardiovascularLevel} from "../../plan/entities/cardiovascularLevel";
import {Target} from "../../target/entities/target.entity";
import {HydrationDay} from "../../plan/entities/hydrationDay.entity";
import {LunchDay} from "../../plan/entities/lunchDay.entity";
import {VegetablesAndFruits} from "../../plan/entities/vegetablesAndFruits.entity";
import {Allergy} from "../../plan/entities/allergy";
import {Intolerance} from "../../plan/entities/intolerance";
import {NutritionPreference} from "../../plan/entities/nutritionPreference";
import {UserActivity} from "../../user-activity/entities/userActivity.entity";
import {UserActivityTarget} from "../../user-activity/entities/userActivityTarget.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstname: string;

    @Column({ nullable: true })
    lastname: string;

    @Column({ unique: true })
    email: string;

    @Column({nullable: true})
    password: string;

    @Column({ nullable: true, type: 'text' })
    imageProfile: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    location: string;

    // @Column({ nullable: true })
    // province: string;

    @Column({ nullable: true })
    cp: string;

    @Column({ nullable: true })
    country: string;

    @Column('geometry', { nullable: true })
    geo: string;

    @Column()
    roleId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: true })
    validatedEmail: Date;

    @Column({ nullable: true })
    uuid: string;

    @Column({ nullable: true })
    refreshToken: string;

    @Column({ default: false })
    isSocialUser: boolean;

    // Health data
    @Column({ nullable: true })
    birthdate: string;

    @Column({ nullable: true })
    height: number;

    @Column({ nullable: true })
    weight: number;

    @Column({ nullable: true })
    otherGender: string;


    // Targets
    @Column({ nullable: true })
    stepsTarget: number;

    @Column({ nullable: true })
    workoutsTarget: number;

    @Column({ nullable: true })
    hydrationTarget: number;

    @Column({ nullable: true })
    nutritionTarget: number;

    @Column({ nullable: true })
    vegetablesAndFruitsTarget: number;

    /**
     * Relations -------------------------------------------------------------
     */

    @ManyToOne(() => Gender, (gender) => gender.users, { nullable: true })
    @JoinColumn({ name: 'genderId' })
    gender: Gender;
    @Column({ nullable: true })
    genderId: number;

    @OneToMany(() => UserLicense, (userLicense) => userLicense.user)
    userLicenses: UserLicense[];

    @OneToMany(() => UserToken, (userToken) => userToken.user)
    tokens: UserToken[];

    @ManyToOne(() => Role)
    @JoinColumn({ name: 'roleId' })
    role: Role;

    @OneToMany(() => UserPoint, (userPoint) => userPoint.target)
    userPoints: UserPoint[];

    @ManyToOne(() => Province)
    @JoinColumn({ name: 'provinceId' })
    province: Province;
    @Column({ nullable: true })
    provinceId: number;

    @OneToMany(() => Recipe, recipe => recipe.user)
    recipes: Recipe[];

    // Ingredient could be used by N recipes
    @ManyToMany(() => Recipe, recipe => recipe.favouritedByUsers)
    @JoinTable()
    favouriteRecipes: Recipe[];

    // Activity and nutrition data -------------------------------------------

    @ManyToOne(() => Referral, (r) => r.users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'referralId' })
    referral: Referral;
    @Column({ nullable: true })
    referralId: number;

    @ManyToOne(() => ActiveData, (ad) => ad.users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'activeDataId' })
    activeData: ActiveData;
    @Column({ nullable: true })
    activeDataId: number;

    @ManyToOne(() => WorkoutWeek, (w) => w.users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'workoutWeekId' })
    workoutWeek: WorkoutWeek;
    @Column({ nullable: true })
    workoutWeekId: number;

    @ManyToOne(() => HydrationDay, (h) => h.users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'hydrationDayId' })
    hydrationDay: HydrationDay;
    @Column({ nullable: true })
    hydrationDayId: number;

    @ManyToOne(() => CardiovascularLevel, (cl) => cl.users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cardiovascularLevelId' })
    cardiovascularLevel: CardiovascularLevel;
    @Column({ nullable: true })
    cardiovascularLevelId: number;

    @ManyToOne(() => LunchDay, (ld) => ld.users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'lunchDayId' })
    lunchDay: LunchDay;
    @Column({ nullable: true })
    lunchDayId: number;

    @ManyToOne(() => VegetablesAndFruits, (vf) => vf.users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vegetablesAndFruitsId' })
    vegetablesAndFruits: VegetablesAndFruits;
    @Column({ nullable: true })
    vegetablesAndFruitsId: number;

    @ManyToOne(() => Target, (cl) => cl.users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'targetId' })
    target: Target;
    @Column({ nullable: true })
    targetId: number;

    @ManyToMany(() => Allergy, a => a.users)
    @JoinTable({name: 'user_allergies',}) // Se define solo en este lado
    allergies: Allergy[];

    @ManyToMany(() => Intolerance, i => i.users)
    @JoinTable({name: 'user_intolerances',}) // Se define solo en este lado
    intolerances: Intolerance[];

    @ManyToMany(() => NutritionPreference, np => np.users)
    @JoinTable({name: 'user_nutrition_preferences',}) // Se define solo en este lado
    nutritionPreferences: NutritionPreference[];

    @OneToMany(() => UserActivity, (ua) => ua.user)
    userActivities: UserActivity[];

    @OneToMany(() => UserActivityTarget, (uat) => uat.user)
    userActivityTargets: UserActivityTarget[];
}