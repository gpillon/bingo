import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { config } from '../config'; 
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    this.seedAdminUser();
  }

  async seedAdminUser() {
    const adminPassword = config.adminPass;
    const adminUser = await this.findOneByUsername('admin');
    if (adminUser) {
      this.usersRepository.update(
        { username: 'admin' },
        {
          name: 'Admin',
          email: 'admin@admin.com',
          role: 'admin',
          password: bcrypt.hashSync(adminPassword, 10),
        },
      );
      return;
    }
    if (!adminUser) {
      const user = new User();
      user.username = 'admin';
      user.role = 'admin';
      user.name = 'Admin';
      user.email = 'admin@admin.com';
      user.password = bcrypt.hashSync(adminPassword, 10);
      await this.usersRepository.save(user);
    }
  }

  async findOne(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: [{ id }],
    });
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: [{ username }],
    });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['games'] });
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const password = bcrypt.hashSync(user.password, 10);
    user.password = password;
    const existingUser = await this.findOneByUsername(user.username);
    if (existingUser) {
      throw new Error('User already exists');
    }
    return this.usersRepository.save(user);
  }

  async update(id: number, user: Partial<Omit<User, 'id'>>): Promise<User> {
    const existingUser = await this.findOne(id);
    if (!existingUser) {
      throw new Error('User does not exist');
    }
    if (user.password) {
      const password = bcrypt.hashSync(user.password, 10);
      user.password = password;
    }
    await this.usersRepository.update(id, user);
    return this.findOne(id);
  }

  async delete(id: number) {
    const existingUser = await this.findOne(id);
    if (!existingUser) {
      throw new Error('User does not exist');
    }
    return this.usersRepository.delete(id);
  }

  async getProfile(id: number) {
    return this.findOne(id);
  }

  async updateProfile(id: number, user: UpdateUserDto) {
    Reflect.deleteProperty(user, 'role');
    await this.update(id, user);
    return this.getProfile(id);
  }
  // Add methods for creating users, etc.
}
