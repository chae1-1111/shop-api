import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { IsString } from 'class-validator';

export class JoinRequestDTO extends PickType(User, [
  'userId',
  'password',
  'name',
  'email',
  'phoneNumber',
  'gender',
  'birthday',
] as const) {}
