import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UserIdentityEntity} from '../entities/user-identity.entity';
import {UserEntity} from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserIdentityEntity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
