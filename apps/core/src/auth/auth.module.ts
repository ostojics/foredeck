import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {JwtModule} from './jwt.module';
import {UserIdentity} from '../common/entities/user-identity.entity';
import {User} from '../common/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserIdentity]), JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
