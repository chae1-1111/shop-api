import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './config/ormconfig';
import { User } from './user/entities/user.entity';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      // DB 설정
      type: 'mysql',
      ...ormconfig, // host, post, username, password, database
      entities: [User],
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
  controllers: [],
  providers: [AuthService],
})
export class AppModule {}
