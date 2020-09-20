import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../entity/user.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-use.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const user = new UserEntity();
    const userInDB = await this.findByEmail(createUserDto.email);
    if (createUserDto.password !== createUserDto.confirm) {
      throw new HttpException("Password didn't match", HttpStatus.BAD_REQUEST);
    }
    if (userInDB) {
      throw new HttpException('Email is existed', HttpStatus.BAD_REQUEST);
    } else {
      user.email = createUserDto.email;
      user.name = createUserDto.name;
      user.password = createUserDto.password;
      const userCreated = await this.usersRepository.save(user);
      const payload = {
        name: userCreated.name,
        id: userCreated.id,
        email: userCreated.email,
        urlAvatar: userCreated.urlAvatar,
      };
      return {
        token: this.jwtService.sign(payload),
      };
    }
  }

  async findAll(): Promise<any> {
    return await this.usersRepository.find();
  }

  async findOne(id: string): Promise<any> {
    return await this.usersRepository.findOne(id);
  }

  async updateOne(id: string, createUserDto: CreateUserDto): Promise<any> {
    return await this.usersRepository.update(id, createUserDto);
  }

  async deleteOne(id: string): Promise<any> {
    return this.usersRepository.delete(id);
  }

  async findByEmail(email: string): Promise<any> {
    return await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async searchUser(search: string): Promise<any> {
    return this.usersRepository.find({
      where: [{ name: Like(`%${search}%`) }, { email: Like(`%${search}%`) }],
    });

    // const users = this.usersRepository
    //   .createQueryBuilder('users')
    //   .andWhere(`(users.name LIKE :search OR users.email LIKE :search)`, {
    //     search: `%${search}%`,
    //   })
    //   .getMany();
    // return users;
  }
}
