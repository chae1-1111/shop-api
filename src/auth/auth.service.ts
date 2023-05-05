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
import * as fs from 'fs';
import * as path from 'path';

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
  async login(loginRequest: LoginRequestDTO): Promise<LoginResponseDTO> {
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
      const accessToken = await this.generateAccessToken({
        id: user.id,
        userId: loginRequest.getUserId(),
      });
      const refreshToken = await this.generateRefreshToken(user);
      return new LoginResponseDTO(accessToken, refreshToken);
    }
  }

  // access token 발급
  generateAccessToken(payload: { id: number; userId: string }): string {
    const privateKey = fs.readFileSync(
      path.resolve(__dirname, '../../src/auth/private.key'),
      'utf8',
    );

    const accessToken = this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: privateKey,
      expiresIn: this.config.get('ACCESS_TOKEN_PERIOD_SEC'),
    });

    return accessToken;
  }

  // refresh token 발급
  async generateRefreshToken(user: User): Promise<string> {
    const privateKey = fs.readFileSync(
      path.resolve(__dirname, '../../src/auth/private.key'),
      'utf8',
    );

    const refreshToken = this.jwtService.sign(
      {},
      {
        algorithm: 'RS256',
        privateKey: privateKey,
        expiresIn: this.config.get('REFRESH_TOKEN_PERIOD_SEC'),
      },
    );

    // 오래된 refresh token
    const result = await this.getOldRefreshToken(user.id);

    // 오래된 refresh token 있는 경우 삭제
    result.length > 0 &&
      (await this.removeRefreshTokens(result.map((i) => i.id)));

    const newAuthData = new Auth(user, refreshToken);

    await this.authRepository.save(newAuthData);

    console.log('Save Token Successfully');

    return refreshToken;
  }

  // 오래된 Refresh Token 검색
  async getOldRefreshToken(userId: number): Promise<any> {
    // 최대 동시 로그인 가능 수
    const maxAccessPoint: number = this.config.get('MAX_ACCESS_POINT');

    const query = this.authRepository
      .createQueryBuilder('auth')
      .where('userId = :id', { id: userId })
      .orderBy('createdAt', 'DESC')
      .limit(10)
      .offset(maxAccessPoint - 1);

    return await query.getMany();
  }

  async removeRefreshTokens(tokenIds: number[]): Promise<void> {
    await this.authRepository
      .createQueryBuilder()
      .delete()
      .where('id in (:ids)', { ids: tokenIds })
      .execute();
    console.log(`${tokenIds.length} refresh token(s) deleted.`);
    return;
  }
}
