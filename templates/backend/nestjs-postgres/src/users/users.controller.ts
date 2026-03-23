import { Controller, Get, Put, Body, Request } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getMe(@Request() req) {
    return this.usersService.findOne(req.user.sub);
  }

  @Put('me')
  updateMe(@Request() req, @Body() body: any) {
    return this.usersService.update(req.user.sub, body);
  }
}
