import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Auth extends BaseEntity {
  constructor(user: User, refreshToken: string) {
    super();
    this.user = user;
    this.refreshToken = refreshToken;
  }

  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @ApiProperty({
    example: 1,
    description: '사용자 고유 id',
  })
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @IsString()
  @ApiProperty({
    example: 'refreshToken',
    description: 'refresh token',
  })
  @Column('text')
  refreshToken: string;

  @IsDate()
  @CreateDateColumn()
  createdAt: Date;
}
