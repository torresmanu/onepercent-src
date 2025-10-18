import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "../../user/entities/user.entity";
import {ActivityType} from "../../activity-type/entities/activity-type.entity";
import {Capsule} from "../../capsule/entities/capsule.entity";
import {Type} from "class-transformer";

export enum UserActivityRegisterType {
    STEPS = 'steps',
    WORKOUT = 'workout',
    COMPENSATE = 'compensate',
}

@Entity()
export class UserActivity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: string;

    @Column({nullable: true})
    title: string;

    @Column({
        type: 'enum',
        enum: UserActivityRegisterType,
        default: UserActivityRegisterType.STEPS
    })
    userActivityRegisterType: UserActivityRegisterType;

    @Column({ type: 'float', nullable: true })
    minutes: number;

    @Column({ type: 'integer', nullable: true })
    steps: number;

    @Column({ type: 'float', nullable: true })
    points: number;

    @Column({ default: false })
    x2: boolean;

    @Column({ type: 'integer', nullable: true })
    perceivedEffort: number;

    @Column({ type: 'float', nullable: true })
    distanceInKms: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    //     Relationships --------------------------------------------------

    @ManyToOne(() => User, (user) => user.userActivities, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
    @Column()
    userId: number;

    @ManyToOne(() => ActivityType, (a) => a.userActivities, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'userActivityId' })
    userActivity: ActivityType;
    @Column({nullable: true})
    userActivityId: number;

    @ManyToOne(() => Capsule, (c) => c.userActivities, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'capsuleId' })
    capsule: Capsule;
    @Column({nullable: true})
    capsuleId: number;


}