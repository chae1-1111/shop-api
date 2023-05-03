import { Injectable, NotFoundException } from '@nestjs/common';
import LoginRequestDTO from './dto/login-request.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import LoginResponseDTO from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  // 로그인
  async login(loginRequest: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { encryptedPassword, id } = await this.userService.getUserByUserId(
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
    } else {
      const accessToken = this.generateAccessToken({
        id: id,
        userId: loginRequest.getUserId(),
      });
      const refreshToken = this.generateRefreshToken({
        id: id,
        userId: loginRequest.getUserId(),
      });
      return new LoginResponseDTO(accessToken, refreshToken);
    }
  }

  generateAccessToken(payload: { id: number; userId: string }): string {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get('ACCESS_TOKEN_PERIOD_SEC'),
      secret: this.config.get('ACCESS_TOKEN_SECRET'),
    });

    return accessToken;
  }

  generateRefreshToken(payload: { id: number; userId: string }): string {
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get('REFRESH_TOKEN_PERIOD_SEC'),
      secret: this.config.get('REFRESH_TOKEN_SECRET'),
    });

    return refreshToken;
  }
}
