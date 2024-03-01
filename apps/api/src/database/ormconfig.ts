import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { join } from "path";

export const ormConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  database: 'dashskins',
  synchronize: true,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
}