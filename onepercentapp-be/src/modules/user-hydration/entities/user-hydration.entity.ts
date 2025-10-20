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

@Entity()
export class UserHydration {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    peeColor: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    //     Relationships --------------------------------------------------

    @ManyToOne(() => User, (user) => user.userHydrations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
    @Column()
    userId: number;
}

