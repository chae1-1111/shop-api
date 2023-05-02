import { Injectable } from '@nestjs/common';
import { JoinGeneralRequestDTO } from './dto/join-general-request.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DupicatedException } from './user.exception';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 아이디 중복 체크
  async idCheck(userId: string): Promise<void> {
    const result = await this.usersRepository.findBy({ userId });
    if (result.length !== 0) {
      // 중복된 아이디 있는 경우 400
      throw new DupicatedException('userId', userId);
    }
  }

  // 휴대폰 번호 중복 체크
  async phoneCheck(phoneNumber: string): Promise<void> {
    const result = await this.usersRepository.findBy({ phoneNumber });
    if (result.length !== 0) {
      // 중복된 휴대폰 번호 있는 경우 400
      throw new DupicatedException('phoneNumber', phoneNumber);
    }
  }

  // 비밀번호 암호화
  async encryptPassword(userData: JoinGeneralRequestDTO): Promise<void> {
    userData.password = await bcrypt.hash(
      userData.password,
      bcrypt.genSaltSync(),
    );
    return Promise.resolve();
  }

  // 회원가입
  async join(userData: JoinGeneralRequestDTO) {
    // 아이디, 휴대폰 중복 체크
    await this.idCheck(userData.userId);
    await this.phoneCheck(userData.phoneNumber);

    // 비밀번호 암호화
    await this.encryptPassword(userData);

    const newUser = userData.toUserEntity();

    const { id } = await this.usersRepository.save(newUser);

    return {
      id: id,
      name: userData.name,
      userId: userData.userId,
    };
  }
}
