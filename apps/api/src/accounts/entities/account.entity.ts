import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum AccountType {
    BANK = 'BANK',
    CASH = 'CASH',
    CREDIT_CARD = 'CREDIT_CARD',
    WALLET = 'WALLET',
    INVESTMENT = 'INVESTMENT',
}

@Entity('accounts')
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index()
    @Column({ name: 'user_id', type: 'uuid' })
    userId!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ type: 'varchar', length: 100, nullable: false })
    name!: string;

    @Column({ type: 'enum', enum: AccountType, default: AccountType.CASH })
    type!: AccountType;

    @Column({ type: 'varchar', length: 3, default: 'INR' })
    currency!: string;

    @Column({ name: 'initial_balance', type: 'decimal', precision: 15, scale: 2, default: 0 })
    initialBalance!: string;

    @Column({ name: 'current_balance', type: 'decimal', precision: 15, scale: 2, default: 0 })
    currentBalance!: string;

    @Column({ name: 'bank_name', type: 'varchar', length: 100, nullable: true, default: null })
    bankName!: string | null;

    @Column({ name: 'account_number_last4', type: 'char', length: 4, nullable: true, default: null })
    accountNumberLast4!: string | null;

    @Column({ type: 'varchar', length: 7, default: '#4F46E5' })
    color!: string;

    @Column({ type: 'varchar', length: 50, nullable: true, default: null })
    icon!: string | null;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive!: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt!: Date;
}
