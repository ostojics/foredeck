import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UserIdentity} from '../common/entities/user-identity.entity';
import {User} from '../common/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserIdentity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
