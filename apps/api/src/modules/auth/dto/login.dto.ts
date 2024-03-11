import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
} from 'class-validator'
import { RegExHelper } from '../../../helpers/regex.helper'

export class LoginDto {
	@IsOptional()
	_id: string

	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string

	@IsNotEmpty()
	@IsString()
	@Matches(RegExHelper.password, {
		message: 'The password must be 8 caracteres',
	})
	password: string
}
