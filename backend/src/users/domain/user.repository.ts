import { User } from './user.model';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  create(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findByName(name: string): Promise<User | null>;
  update(name: string, user: User): Promise<User | null>;
  delete(name: string): Promise<boolean>;
}
