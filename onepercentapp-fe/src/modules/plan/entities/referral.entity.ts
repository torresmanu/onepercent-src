import {
    Column,
    CreateDateColumn,
    Entity, ManyToMany, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Ingredient} from "../../ingredient/entities/ingredient.entity";
import {User} from "../../user/entities/user.entity";
import {UserLicense} from "../../user-license/entities/user-license.entity";

@Entity()
export class Referral {
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
     * Relationships ------------------------------------------------
     */

    @OneToMany(() => User, (ul) => ul.referral)
    users: User[];

}