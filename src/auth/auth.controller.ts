import { Body, Controller, Get } from '@nestjs/common';
import LoginRequestDTO from './dto/login-request.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async login(@Body() loginRequest: LoginRequestDTO): Promise<string> {
    const result = await this.authService.login(loginRequest);

    return 'result';
  }
}
