import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	ObjectId,
	ObjectIdColumn,
	UpdateDateColumn,
} from 'typeorm'

@Entity()
export class User {
	@ObjectIdColumn()
	_id?: ObjectId

	@Column()
	name: string

	@Column()
	age: number

	@Column({
		unique: true,
	})
	email: string

	@Column()
	avatar: string

	@CreateDateColumn({ name: 'created_at' })
	createdAt?: string

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt?: string

	@DeleteDateColumn({ name: 'deleted_at' })
	deletedAt?: string
}
