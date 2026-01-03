import {Entity, PrimaryGeneratedColumn, Column, OneToOne} from 'typeorm';
import {UserIdentity} from './user-identity.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({name: 'tenant_id', type: 'uuid'})
  tenantId: string;

  @Column({type: 'text'})
  email: string;

  @Column({name: 'full_name', type: 'text'})
  fullName: string;

  @OneToOne(() => UserIdentity, (identity) => identity.user)
  identity: UserIdentity;
}
