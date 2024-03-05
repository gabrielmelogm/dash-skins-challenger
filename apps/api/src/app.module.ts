import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ormConfig } from './database/ormconfig'
import { UsersSeed } from './database/seeds/users.seed'
import { AuthModule } from './modules/auth/auth.module'
import { User } from './modules/users/entities/User.entity'
import { UsersModule } from './modules/users/users.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRoot(ormConfig),
		TypeOrmModule.forFeature([User]),
		UsersModule,
		AuthModule,
	],
	controllers: [],
	providers: [UsersSeed],
})
export class AppModule {}
