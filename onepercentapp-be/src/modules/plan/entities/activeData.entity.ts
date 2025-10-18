import {
    Column,
    CreateDateColumn,
    Entity, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {UserLicense} from "../../user-license/entities/user-license.entity";
import {User} from "../../user/entities/user.entity";

@Entity()
export class ActiveData {
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

    @OneToMany(() => User, (ul) => ul.activeData)
    users: User[];

}