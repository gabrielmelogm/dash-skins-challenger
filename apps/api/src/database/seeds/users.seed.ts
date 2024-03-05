import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { hashSync } from 'bcrypt'
import { Repository } from 'typeorm'
import { CreateUserDto } from '../../modules/users/dto/create-user.dto'
import { User } from '../../modules/users/entities/User.entity'

@Injectable()
export class UsersSeed {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	async seedUsers() {
		const existingUsers = await this.usersRepository.find()
		if (existingUsers.length > 0) {
			console.log('Users already exist in the database. Ignoring seeds.')
			return
		}

		const sampleUsers: CreateUserDto[] = [
			{
				name: faker.person.firstName(),
				age: faker.number.int({ min: 18, max: 90 }),
				email: 'email@test.com',
				avatar: faker.image.urlLoremFlickr(),
				password: hashSync('Senha123@', 10),
			},
		]

		await this.usersRepository.save(sampleUsers)
		console.log('User seeding completed successfully.')
	}
}
