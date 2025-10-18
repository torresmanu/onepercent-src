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
import {License} from "../../license/entities/license.entity";
import {Referral} from "../../plan/entities/referral.entity";
import {ActiveData} from "../../plan/entities/activeData.entity";
import {WorkoutWeek} from "../../plan/entities/workoutWeek.entity";
import {CardiovascularLevel} from "../../plan/entities/cardiovascularLevel";
import {Target} from "../../target/entities/target.entity";

@Entity()
export class UserLicense {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    active: boolean;

    @Column({ nullable: true })
    subscriptionId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    //     Relationships --------------------------------------------------

    @ManyToOne(() => User, (user) => user.userLicenses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => License, (license) => license.userLicenses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'licenseId' })
    license: License;
}