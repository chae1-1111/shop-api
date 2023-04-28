import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from './user-role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString, isNumber } from 'class-validator';

@Entity()
export class User {
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

  @IsString()
  @ApiProperty({ example: 'user', description: '사용자 아이디' })
  @Column({ nullable: false, unique: true })
  userId: string;

  @IsString()
  @ApiProperty({ example: 'password', description: '사용자 비밀번호' })
  @Column({ nullable: false })
  password: string;

  @IsString()
  @ApiProperty({ example: 'testing@test.com', description: '사용자 이메일' })
  @Column()
  email: string;

  @IsString()
  @ApiProperty({ example: '010-1234-5678', description: '사용자 전화번호' })
  @Column({ nullable: false, unique: true })
  phoneNumber: string;

  @IsDate()
  @ApiProperty({ example: '1990-01-01', description: '사용자 생년월일' })
  @Column()
  birthday: Date;

  @IsString()
  @ApiProperty({ example: 'Male', description: "성별('Male' or 'Female')" })
  @Column()
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
}
