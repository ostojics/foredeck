import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne} from 'typeorm';
import {TenantEntity} from './tenant.entity';

@Entity('licenses')
export class LicenseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'text', unique: true, name: 'license_key'})
  licenseKey: string;

  @Column({type: 'timestamptz', name: 'expires_at'})
  expiresAt: Date;

  @Column({type: 'jsonb', default: {}})
  metadata: Record<string, unknown>;

  @CreateDateColumn({type: 'timestamptz', name: 'created_at'})
  createdAt: Date;

  @OneToOne(() => TenantEntity, (tenant) => tenant.license)
  tenant: TenantEntity;
}
