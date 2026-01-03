import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UserIdentity} from '../common/entities/user-identity.entity';
import {UserEntity} from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserIdentity, UserEntity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
