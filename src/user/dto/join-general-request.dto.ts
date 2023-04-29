import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class JoinGeneralRequestDTO extends PickType(User, [
  'userId',
  'password',
  'name',
  'email',
  'phoneNumber',
  'gender',
  'birthday',
] as const) {
  toUserEntity(): User {
    return User.fromJoinGeneral({
      name: this.name,
      userId: this.userId,
      password: this.password,
      email: this.email,
      phoneNumber: this.phoneNumber,
      gender: this.gender,
      birthday: this.birthday,
    });
  }
}
