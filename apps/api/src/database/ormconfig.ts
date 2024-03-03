import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/User.entity';
import { env } from '../../env';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: env.DATABASE_URL,
  synchronize: env.NODE_ENV === 'development',
  entities: [User],
};
