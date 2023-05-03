import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import UserRegExp from './user.regExp';
import { Auth } from 'src/auth/entities/auth.entity';

@Entity()
export class User extends BaseEntity {
  @IsNumber()
  @ApiProperty({ example: 1, description: '사용자 고유 id' })
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @ApiProperty({ example: 'USER', description: '사용자 권한' })
  @Column({ nullable: false })
  role: string;

  @IsString()
  @ApiProperty({ example: '홍길동', description: '사용자 이름' })
  @Column({ nullable: false })
  name: string;

  @Matches(UserRegExp.userIdRegExp, { message: 'userId format is invalid' })
  @ApiProperty({ example: 'userid', description: '사용자 아이디' })
  @Column({ nullable: false, unique: true })
  userId: string;

  @Matches(UserRegExp.passwordRegExp, { message: 'password format is invalid' })
  @ApiProperty({ example: 'password', description: '사용자 비밀번호' })
  @Column({ nullable: false })
  password: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'testing@test.com', description: '사용자 이메일' })
  @Column()
  email: string;

  @Matches(UserRegExp.phoneNumberRegExp, {
    message: 'phoneNumber format is invalid',
  })
  @ApiProperty({ example: '010-1234-5678', description: '사용자 전화번호' })
  @Column({ nullable: false, unique: true })
  phoneNumber: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @ApiProperty({ example: '1990-01-01', description: '사용자 생년월일' })
  @Column({ nullable: true })
  birthday: Date;

  @IsIn(['Male', 'Female'])
  @IsOptional()
  @ApiProperty({ example: 'Male', description: "성별('Male' or 'Female')" })
  @Column({ nullable: true })
  gender: 'Male' | 'Female';

  @IsDate()
  @ApiProperty({
    example: '2000-01-01T00:00:00',
    description: '사용자 가입 일시',
  })
  @CreateDateColumn()
  createdAt: Date;

  @IsString()
  @ApiProperty({
    example: 'KaKao;Naver;Google;',
    description: '가입 소셜 채널',
  })
  @Column()
  socialChannel: string;

  static fromJoinGeneral(userData: {
    name: string;
    userId: string;
    password: string;
    email?: string;
    phoneNumber: string;
    gender?: 'Male' | 'Female';
    birthday?: Date;
  }) {
    const user = new User();

    user.role = 'USER';
    user.name = userData.name;
    user.userId = userData.userId;
    user.password = userData.password;
    user.email = userData.email;
    user.phoneNumber = userData.phoneNumber;
    user.birthday = userData.birthday;
    user.gender = userData.gender;
    user.createdAt = new Date();
    user.socialChannel = '';

    return user;
  }
}
