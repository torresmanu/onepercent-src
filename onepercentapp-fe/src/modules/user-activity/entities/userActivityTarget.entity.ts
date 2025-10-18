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

@Entity()
export class UserActivityTarget {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date', nullable: false })
    date: Date;

    @Column({ type: 'integer', nullable: false })
    extraMinutes: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    //     Relationships --------------------------------------------------

    @ManyToOne(() => User, (user) => user.userActivityTargets, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
    @Column()
    userId: number;

}