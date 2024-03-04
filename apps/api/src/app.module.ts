import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ormConfig } from './database/ormconfig'
import { UsersModule } from './modules/users/users.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRoot(ormConfig),
		UsersModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
