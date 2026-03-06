import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum CategoryType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
    TRANSFER = 'TRANSFER',
}

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index()
    @Column({ name: 'user_id', type: 'uuid', nullable: true, default: null })
    userId!: string | null;

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'user_id' })
    user!: User | null;

    @Column({ type: 'varchar', length: 100, nullable: false })
    name!: string;

    @Column({ type: 'enum', enum: CategoryType })
    type!: CategoryType;

    @Column({ name: 'parent_id', type: 'uuid', nullable: true, default: null })
    parentId!: string | null;

    @ManyToOne(() => Category, { nullable: true })
    @JoinColumn({ name: 'parent_id' })
    parent!: Category | null;

    @Column({ type: 'varchar', length: 50, default: 'tag' })
    icon!: string;

    @Column({ type: 'varchar', length: 7, default: '#6B7280' })
    color!: string;

    @Column({ name: 'is_default', type: 'boolean', default: false })
    isDefault!: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt!: Date;
}
