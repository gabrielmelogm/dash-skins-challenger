import {
	IsEmail,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	MinLength,
} from 'class-validator'

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	@MinLength(2)
	name: string

	@IsOptional()
	@IsEmail()
	email: string

	@IsOptional()
	@IsNumber()
	@IsPositive()
	age: number

	@IsOptional()
	@IsString()
	avatar: string
}
