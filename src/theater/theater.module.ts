import { User } from './../users/entity/user.entity';
import { UsersModule } from './../users/users.module';
import { Theater } from './entity/theater.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TheaterController } from './controller/theater.controller';
import { TheaterService } from './service/theater.service';

@Module({
  imports: [TypeOrmModule.forFeature([Theater, User])],
  controllers: [TheaterController],
  providers: [TheaterService],
  exports: [TheaterService],
})
export class TheaterModule {}
