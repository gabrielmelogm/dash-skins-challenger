import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/User.entity";
import { UsersService } from "./users.service";


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async Store(@Body() user: CreateUserDto): Promise<User | HttpException> {
    try {
      return await this.usersService.Store(user)
    } catch (error) {
      return new HttpException(error?.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get(':email')
  async FindByEmail(@Param('email') email: string): Promise<User> {
    return await this.usersService.FindByEmail(email)
  }
}