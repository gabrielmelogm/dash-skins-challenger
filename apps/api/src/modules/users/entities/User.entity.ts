import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('string')
  name: string

  @Column('int')
  age: number

  @Column({
    type: 'string',
    unique: true
  })
  email: string

  @Column('string')
  avatar: string
}