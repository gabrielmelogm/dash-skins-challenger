import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/User.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateResult } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async Store(@Body() user: CreateUserDto): Promise<User | HttpException> {
    try {
      return await this.usersService.Store(user);
    } catch (error) {
      return new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async FindAll(): Promise<User[]> {
    return await this.usersService.FindAll();
  }

  @Get(':id')
  async FindByEmail(@Param('id') id: string): Promise<User> {
    return await this.usersService.FindById(id);
  }

  @Put(':id')
  async Update(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.usersService.Update(id, user);
  }
}
