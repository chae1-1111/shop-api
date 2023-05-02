import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './config/orm.config';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { Auth } from './auth/entities/auth.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      // DB 설정
      type: 'mysql',
      ...ormconfig, // host, post, username, password, database
      entities: [User, Auth],
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
