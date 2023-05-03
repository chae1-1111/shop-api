import { Injectable, NotFoundException } from '@nestjs/common';
import LoginRequestDTO from './dto/login-request.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import LoginResponseDTO from './dto/login-response.dto';
import { Auth } from './entities/auth.entity';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  // 로그인
  async login(
    loginRequest: LoginRequestDTO,
    userAgent: string,
  ): Promise<LoginResponseDTO> {
    const user = await this.userService.getUserByUserId(
      loginRequest.getUserId(),
    );

    // 비밀번호 일치 여부 확인
    const result = await bcrypt.compareSync(
      loginRequest.getPassword(),
      user.password,
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
        id: user.id,
        userId: loginRequest.getUserId(),
      });
      const refreshToken = await this.generateRefreshToken(user, userAgent);
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

  async generateRefreshToken(user: User, userAgent: string): Promise<string> {
    const refreshToken = this.jwtService.sign(
      {},
      {
        expiresIn: this.config.get('REFRESH_TOKEN_PERIOD_SEC'),
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
      },
    );

    const result = await this.authRepository
      .createQueryBuilder('auth')
      .where('userId = :id', { id: user.id })
      .andWhere('userAgent = :userAgent', { userAgent })
      .getExists();

    if (result) {
      console.log('Exist');
    } else {
      console.log('not Exist');
      const newAuthData = new Auth(user, refreshToken, userAgent);
      await this.authRepository.save(newAuthData);
    }

    return refreshToken;
  }
}
