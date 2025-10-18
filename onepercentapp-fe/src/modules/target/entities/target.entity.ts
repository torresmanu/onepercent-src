import {
    Column,
    CreateDateColumn,
    Entity, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {UserPoint} from "../../user-point/entities/user-point.entity";
import {UserLicense} from "../../user-license/entities/user-license.entity";
import {User} from "../../user/entities/user.entity";

@Entity()
export class Target {
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

    //     Relationships --------------------------------------------------

    @OneToMany(() => UserPoint, (userPoint) => userPoint.target)
    userPoints: UserPoint[];

    @OneToMany(() => User, (ul) => ul.target)
    users: User[];
}