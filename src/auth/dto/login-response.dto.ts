import { IsString } from 'class-validator';

export default class LoginResponseDTO {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
