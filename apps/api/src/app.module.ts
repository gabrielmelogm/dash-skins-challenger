import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './database/ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
