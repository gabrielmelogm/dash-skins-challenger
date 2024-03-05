import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { ObjectId } from 'mongodb'
import { Repository, UpdateResult } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/User.entity'

export type IUserResponse = {
	_id: ObjectId
	name: string
	age: number
	email: string
	avatar: string
}

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	async Store(user: CreateUserDto): Promise<User> {
		const getUser = await this.usersRepository.findOne({
			where: {
				email: user.email,
			},
		})

		if (getUser) throw new ConflictException('User with email already exists')

		const createdUser = this.usersRepository.create(user)
		return await this.usersRepository.save(createdUser)
	}

	async FindById(id: string): Promise<IUserResponse> {
		try {
			const user = await this.usersRepository.findOneOrFail({
				where: { _id: new ObjectId(id) },
			})

			if (!user) {
				throw new NotFoundException(null)
			}

			return {
				_id: user._id,
				name: user.name,
				age: user.age,
				email: user.email,
				avatar: user.avatar,
			}
		} catch (error) {
			throw new NotFoundException(null)
		}
	}

	async FindByEmail(email: string): Promise<User> {
		const user = await this.usersRepository.findOneOrFail({
			where: { email },
		})

		if (!user) {
			throw new NotFoundException(null)
		}

		return user
	}

	async FindAll(): Promise<IUserResponse[]> {
		const users = await this.usersRepository.find()
		const list: IUserResponse[] = []

		for (const user of users) {
			list.push({
				_id: user._id,
				name: user.name,
				age: user.age,
				email: user.email,
				avatar: user.avatar,
			})
		}

		return list
	}

	async Update(id: string, user: UpdateUserDto): Promise<UpdateResult> {
		const userSearched = await this.FindById(id)

		if (userSearched) {
			const updatedUser = await this.usersRepository.update(
				userSearched._id,
				user,
			)

			return updatedUser
		}
	}
}
