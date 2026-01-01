import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne} from 'typeorm';
import {LicenseEntity} from './license.entity';
import {UserEntity} from './user.entity';

@Entity('tenants')
export class TenantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'uuid', name: 'license_id', unique: true})
  licenseId: string;

  @Column({type: 'text'})
  name: string;

  @Column({type: 'text', unique: true})
  slug: string;

  @Column({type: 'text', nullable: true})
  url: string | null;

  @OneToOne(() => LicenseEntity, (license) => license.tenant)
  @JoinColumn({name: 'license_id'})
  license: LicenseEntity;

  @OneToMany(() => UserEntity, (user) => user.tenant)
  users: UserEntity[];
}
