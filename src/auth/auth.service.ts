import { Injectable, NotFoundException } from '@nestjs/common';
import LoginRequestDTO from './dto/login-request.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(loginRequest: LoginRequestDTO): Promise<boolean> {
    const encryptedPassword = await this.userService.getEncryptedPassword(
      loginRequest.getUserId(),
    );

    // 비밀번호 일치 여부 확인
    const result = await bcrypt.compareSync(
      loginRequest.getPassword(),
      encryptedPassword,
    );

    // 비밀번호 일치하지 않는 경우 Not Found Error
    if (!result) {
      throw new NotFoundException({
        errors: {
          error: 'Login failed',
          msg: 'Login failed : User not found matching the provided Id and Password.',
        },
      });
    }

    return;
  }
}
