import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import LoginRequestDTO from './dto/login-request.dto';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return password', async () => {
    service.login(new LoginRequestDTO('user14', 'password1!'));
  });
});
