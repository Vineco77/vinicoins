import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UserAlreadyExistsError, UserNotFoundError } from '../domain/errors';
import { SecretKeyGuard } from '../../common/guards/secret-key.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(SecretKeyGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.handleErrors(() => this.usersService.create(createUserDto));
  }

  @Get()
  async findAll() {
    return this.handleErrors(() => this.usersService.findAll());
  }

  @Get(':name')
  async findOne(@Param('name') name: string) {
    return this.handleErrors(() => this.usersService.findByName(name));
  }

  @Patch(':name')
  async update(
    @Param('name') name: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.handleErrors(() =>
      this.usersService.update(name, updateUserDto),
    );
  }

  @Delete(':name')
  async delete(@Param('name') name: string) {
    return this.handleErrors(() => this.usersService.delete(name));
  }

  private async handleErrors<T>(action: () => Promise<T>): Promise<T> {
    try {
      return await action();
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }

      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }
}
