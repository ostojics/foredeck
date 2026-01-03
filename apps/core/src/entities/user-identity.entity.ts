import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from 'typeorm';
import {UserEntity} from './user.entity';

@Entity('user_identities')
export class UserIdentityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'uuid', name: 'user_id', unique: true})
  userId: string;

  @Column({type: 'text'})
  provider: string;

  @Column({type: 'text', name: 'provider_id'})
  providerId: string;

  @Column({type: 'text', nullable: true, name: 'password_hash'})
  passwordHash: string | null;

  @OneToOne(() => UserEntity, (user) => user.identity)
  @JoinColumn({name: 'user_id'})
  user: UserEntity;
}
