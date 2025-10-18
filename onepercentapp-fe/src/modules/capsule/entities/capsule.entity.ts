import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {ActivityMaterial} from "../../activity-material/entities/activity-material.entity";
import {ActivityType} from "../../activity-type/entities/activity-type.entity";
import {ActivityIntensity} from "../../activity-intensity/entities/activity-intensity.entity";
import {ActivityCategory} from "../../activity-category/entities/activity-category.entity";
import {UserActivity} from "../../user-activity/entities/userActivity.entity";

@Entity()
export class Capsule {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({nullable: true})
    thumbnail: string;

    @Column()
    publishDate: Date;

    @Column({nullable: true, type: 'text'})
    material: string;

    @Column()
    durationInMinutes: number;

    @Column({nullable: true, type: 'text'})
    trainingType: string;

    @Column({nullable: true})
    perceivedEffort: number;

    @Column({nullable: true, type: 'text'})
    description: string;

    @Column({nullable: true, type: 'text'})
    exerciseList: string;

    @Column({default: false})
    free: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    /**
     * Relationships -----------------------------------------------------------
     */

    @ManyToOne(() => ActivityCategory)
    @JoinColumn({ name: 'activityCategoryId' })
    activityCategory: ActivityCategory;
    @Column()
    activityCategoryId: number;

    @JoinColumn({ name: 'activityIntensityId' })
    @ManyToOne(() => ActivityIntensity)
    activityIntensity: ActivityIntensity;
    @Column()
    activityIntensityId: number;

    @OneToMany(() => UserActivity, (ua) => ua.userActivity)
    userActivities: UserActivity[];

}