import { IsString } from 'class-validator';

export default class LoginResponseDTO {
  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
