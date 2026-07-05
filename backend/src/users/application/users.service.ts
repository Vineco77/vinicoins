import { Inject, Injectable } from '@nestjs/common';
import { UserNotFoundError } from '../domain/errors';
import { USER_REPOSITORY, UserRepository } from '../domain/user.repository';
import { User } from '../domain/user.model';

export interface CreateUserInput {
  name: string;
  viniCoins: number;
}

export interface UpdateUserInput {
  name?: string;
  viniCoins?: number;
}

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) { }

  create(input: CreateUserInput): Promise<User> {
    return this.userRepository.create(this.normalizeUser(input));
  }

  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findByName(name: string): Promise<User> {
    const user = await this.userRepository.findByName(this.normalizeName(name));

    if (!user) {
      throw new UserNotFoundError(name);
    }

    return user;
  }

  async update(name: string, input: UpdateUserInput): Promise<User> {
    const currentName = this.normalizeName(name);
    const existingUser = await this.userRepository.findByName(currentName);

    if (!existingUser) {
      throw new UserNotFoundError(name);
    }

    const updatedUser = this.normalizeUser({
      name: input.name ?? existingUser.name,
      viniCoins:
        typeof input.viniCoins === 'number'
          ? input.viniCoins
          : existingUser.viniCoins,
    });

    const persistedUser = await this.userRepository.update(
      currentName,
      updatedUser,
    );

    if (!persistedUser) {
      throw new UserNotFoundError(name);
    }

    return persistedUser;
  }

  async delete(name: string): Promise<void> {
    const deleted = await this.userRepository.delete(this.normalizeName(name));

    if (!deleted) {
      throw new UserNotFoundError(name);
    }
  }

  private normalizeUser(input: CreateUserInput): User {
    return {
      name: this.normalizeName(input.name),
      viniCoins: this.normalizeViniCoins(input.viniCoins),
    };
  }

  private normalizeName(name: string): string {
    return name.trim();
  }

  private normalizeViniCoins(viniCoins: number): number {
    return Math.round(viniCoins * 100) / 100;
  }
}
