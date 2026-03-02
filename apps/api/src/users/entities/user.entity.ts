import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Index,
} from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 255, nullable: false })
    email!: string;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 20, nullable: true, default: null })
    phone!: string | null;

    /**
     * bcrypt hash, cost factor 12. Null for social logins.
     */
    @Column({ name: 'password_hash', type: 'varchar', length: 255, nullable: true, default: null })
    passwordHash!: string | null;

    @Column({ name: 'full_name', type: 'varchar', length: 100, nullable: false })
    fullName!: string;

    @Column({ type: 'char', length: 2, default: 'IN' })
    country!: string;

    @Column({ type: 'varchar', length: 3, default: 'INR' })
    currency!: string;

    @Column({ name: 'is_premium', type: 'boolean', default: false })
    isPremium!: boolean;

    @Column({ name: 'avatar_url', type: 'text', nullable: true, default: null })
    avatarUrl!: string | null;

    @Column({ name: 'fcm_token', type: 'text', nullable: true, default: null })
    fcmToken!: string | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt!: Date;

    /**
     * Soft delete — never hard-DELETE rows per project rules.
     */
    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
    deletedAt!: Date | null;
}
