import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ormConfig } from '../../database/ormconfig'
import { User } from './entities/User.entity'
import { UsersController } from './users.controller'
import { UsersModule } from './users.module'
import { UsersService } from './users.service'

describe('UsersController', () => {
	let usersController: UsersController
	let usersService: UsersService

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			imports: [
				TypeOrmModule.forRoot(ormConfig),
				TypeOrmModule.forFeature([User]),
				UsersModule,
			],
			controllers: [UsersController],
			providers: [UsersService],
		}).compile()

		usersController = app.get<UsersController>(UsersController)
		usersService = app.get<UsersService>(UsersService)
	})

	it('should be able the controller is defined', () => {
		expect(usersController).toBeDefined()
	})
})
