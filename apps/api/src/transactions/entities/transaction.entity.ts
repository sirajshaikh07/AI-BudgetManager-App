import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Account } from '../../accounts/entities/account.entity';
import { Category } from '../../categories/entities/category.entity';

export enum TransactionType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
    TRANSFER = 'TRANSFER',
}

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index()
    @Column({ name: 'user_id', type: 'uuid' })
    userId!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Index()
    @Column({ name: 'account_id', type: 'uuid' })
    accountId!: string;

    @ManyToOne(() => Account, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'account_id' })
    account!: Account;

    @Column({ name: 'to_account_id', type: 'uuid', nullable: true, default: null })
    toAccountId!: string | null;

    @ManyToOne(() => Account, { nullable: true })
    @JoinColumn({ name: 'to_account_id' })
    toAccount!: Account | null;

    @Column({ name: 'category_id', type: 'uuid' })
    categoryId!: string;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category!: Category;

    @Column({ type: 'enum', enum: TransactionType })
    type!: TransactionType;

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
    amount!: string;

    @Column({ type: 'varchar', length: 3, default: 'INR' })
    currency!: string;

    @Index()
    @Column({ name: 'transaction_date', type: 'timestamptz', nullable: false })
    transactionDate!: Date;

    @Column({ type: 'varchar', length: 255, nullable: true, default: null })
    description!: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true, default: null })
    merchant!: string | null;

    @Column({ name: 'is_recurring_instance', type: 'boolean', default: false })
    isRecurringInstance!: boolean;

    @Column({ name: 'recurring_rule_id', type: 'uuid', nullable: true, default: null })
    recurringRuleId!: string | null;

    @Column({ type: 'text', array: true, default: '{}' })
    tags!: string[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt!: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
    deletedAt!: Date | null;
}
