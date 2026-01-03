import {Global, Module} from '@nestjs/common';
import {JwtModule as NestJWTModule} from '@nestjs/jwt';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtService} from './jwt.service';
import {JwtConfig, JwtConfigName} from '../config/jwt.config';

@Global()
@Module({
  imports: [
    NestJWTModule.registerAsync({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore expiresIn typing issue
      useFactory: (configService: ConfigService) => {
        const jwtConfig = configService.getOrThrow<JwtConfig>(JwtConfigName);

        return {
          secret: jwtConfig.secret,
          signOptions: {expiresIn: jwtConfig.expiresIn},
        };
      },
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
