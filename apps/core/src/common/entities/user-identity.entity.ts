import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from 'typeorm';
import {User} from './user.entity';

@Entity('user_identities')
export class UserIdentity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({name: 'user_id', type: 'uuid', unique: true})
  userId: string;

  @Column({type: 'text'})
  provider: string;

  @Column({name: 'provider_id', type: 'text'})
  providerId: string;

  @Column({name: 'password_hash', type: 'text', nullable: true})
  passwordHash: string | null;

  @OneToOne(() => User, (user) => user.identity)
  @JoinColumn({name: 'user_id'})
  user: User;
}
