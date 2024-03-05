import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Put,
	Res,
	UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Response } from 'express'
import { UpdateResult } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/User.entity'
import { IUserResponse, UsersService } from './users.service'

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	async Store(
		@Body() user: CreateUserDto,
		@Res() response: Response,
	): Promise<any> {
		try {
			return await this.usersService.Store(user)
		} catch (error) {
			if (error.message === 'User with email already exists') {
				return response
					.status(HttpStatus.CONFLICT)
					.send(new HttpException(error.message, HttpStatus.CONFLICT))
			}

			return new HttpException(error?.message, HttpStatus.BAD_REQUEST)
		}
	}

	@Get()
	async FindAll(): Promise<IUserResponse[]> {
		return await this.usersService.FindAll()
	}

	@Get(':id')
	async FindByEmail(@Param('id') id: string): Promise<IUserResponse> {
		return await this.usersService.FindById(id)
	}

	@Put(':id')
	async Update(
		@Param('id') id: string,
		@Body() user: UpdateUserDto,
	): Promise<UpdateResult> {
		return await this.usersService.Update(id, user)
	}
}
