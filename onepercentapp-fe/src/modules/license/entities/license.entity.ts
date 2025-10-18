import {
    Column,
    CreateDateColumn,
    Entity, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {UserLicense} from "../../user-license/entities/user-license.entity";

@Entity()
export class License {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({nullable: true})
    description: string;

    @Column({type: 'float'})
    price: number;

    @Column({nullable: true})
    googleProductId: string;

    @Column({nullable: true})
    appleProductId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    //     Relationships --------------------------------------------------

    @OneToMany(() => UserLicense, (userLicense) => userLicense.license)
    userLicenses: UserLicense[];
}