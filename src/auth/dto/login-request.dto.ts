import { IsString } from 'class-validator';

export default class LoginRequestDTO {
  constructor(userId: string, password: string) {
    this.userId = userId;
    this.password = password;
  }

  @IsString()
  private userId: string;

  @IsString()
  private password: string;

  public getUserId(): string {
    return this.userId;
  }

  public getPassword(): string {
    return this.password;
  }
}
