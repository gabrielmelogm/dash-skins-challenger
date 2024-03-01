import { IsEmail, IsInt, IsNotEmpty } from "class-validator";

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
}