import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Auth extends BaseEntity {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @ApiProperty({
    example: 1,
    description: '사용자 고유 id',
  })
  @ManyToOne(() => User, (user) => user.auths)
  user: User;

  @IsString()
  @ApiProperty({
    example: 'refreshToken',
    description: 'refresh token',
  })
  @Column()
  refreshToken: string;

  @IsString()
  @Column()
  userAgent: string;
}
