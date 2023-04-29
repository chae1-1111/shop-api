import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { JoinGeneralRequestDTO } from './dto/join-general-request.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  join(@Body() userData: JoinGeneralRequestDTO) {
    return this.userService.join(userData);
  }

  @Get('/idCheck')
  idCheck(@Query('id') id: string) {
    // return this.userService.idCheck(id);
  }

  @Get('/phoneCheck')
  phoneCheck(@Query('phoneNumber') phoneNumber: string) {
    // return this.userService.phoneCheck(phoneNumber);
  }
}
