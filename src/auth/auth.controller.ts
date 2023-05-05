import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import LoginRequestDTO from './dto/login-request.dto';
import { AuthService } from './auth.service';
import LoginResponseDTO from './dto/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(
    @Body() loginRequest: LoginRequestDTO,
  ): Promise<LoginResponseDTO> {
    return await this.authService.login(loginRequest);
  }
}
