import {Module} from '@nestjs/common';
import {JwtModule as NestJwtModule} from '@nestjs/jwt';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtService} from './jwt.service';
import {GlobalConfig} from '../config/config.interface';
import {JwtConfig, JwtConfigName} from '../config/jwt.config';

@Module({
  imports: [
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<GlobalConfig>) => {
        const config = configService.getOrThrow<JwtConfig>(JwtConfigName);
        return {
          secret: config.secret,
        };
      },
    }),
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
