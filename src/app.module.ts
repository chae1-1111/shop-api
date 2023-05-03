import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './config/orm.config';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { Auth } from './auth/entities/auth.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    AuthModule,
    TypeOrmModule.forRoot({
      // DB 설정
      type: 'mysql',
      ...ormconfig, // host, post, username, password, database
      entities: [User, Auth],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
