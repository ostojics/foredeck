import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne} from 'typeorm';
import {TenantEntity} from './tenant.entity';
import {UserIdentityEntity} from './user-identity.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'uuid', name: 'tenant_id'})
  tenantId: string;

  @Column({type: 'text'})
  email: string;

  @Column({type: 'text', name: 'full_name'})
  fullName: string;

  @ManyToOne(() => TenantEntity, (tenant) => tenant.users)
  @JoinColumn({name: 'tenant_id'})
  tenant: TenantEntity;

  @OneToOne(() => UserIdentityEntity, (identity) => identity.user)
  identity: UserIdentityEntity;
}
