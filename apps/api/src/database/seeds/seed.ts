import { NestFactory } from '@nestjs/core'
import { AppModule } from '../../app.module'
import { UsersSeed } from './users.seed'

export async function main(): Promise<void> {
	const app = await NestFactory.createApplicationContext(AppModule)
	const usersSeed = app.get(UsersSeed)

	try {
		await usersSeed.seedUsers()
	} catch (error) {
		console.error(`Error when running the seed: ${error}`)
	}

	await app.close()
}

main()
