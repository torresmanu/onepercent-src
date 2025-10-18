import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Province {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;
}