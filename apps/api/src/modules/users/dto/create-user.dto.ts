import { IsEmail, IsInt, IsNotEmpty, IsString, Matches } from 'class-validator'
import { RegExHelper } from '../../../helpers/regex.helper'

export class CreateUserDto {
	@IsNotEmpty()
	name: string

	@IsNotEmpty()
	@IsInt()
	age: number

	@IsNotEmpty()
	@IsEmail()
	email: string

	@IsNotEmpty()
	avatar: string

	@IsNotEmpty()
	@IsString()
	@Matches(RegExHelper.password, {
		message: 'The password must be 8 caracteres',
	})
	password: string
}
