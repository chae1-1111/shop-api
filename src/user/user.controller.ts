import { Body, Controller, Post } from '@nestjs/common';
import { JoinRequestDTO } from './dto/join-request.dto';

@Controller('user')
export class UserController {
  @Post()
  join(@Body() userData: JoinRequestDTO) {
    return `joined : ${userData.name}`;
  }
}
