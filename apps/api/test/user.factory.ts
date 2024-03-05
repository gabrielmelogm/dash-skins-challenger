import { faker } from '@faker-js/faker'
import { hashSync } from 'bcrypt'
import { CreateUserDto } from '../src/modules/users/dto/create-user.dto'

export const user: CreateUserDto = {
	name: faker.person.firstName(),
	email: 'email@test.com',
	password: 'Jasg102190!@',
	age: faker.number.int({ min: 18, max: 90 }),
	avatar: faker.image.urlLoremFlickr(),
}
