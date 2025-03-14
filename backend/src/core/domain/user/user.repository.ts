import { User } from '@/core/domain/user/user';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  checkExistsById(userId: string): Promise<boolean>;

  save(user: User): Promise<User>;

  getUserIdByEmail(email: string): Promise<string | undefined>;

  getUserByEmail(email: string): Promise<User | undefined>;
}

export interface IFirestoreUserRepository extends UserRepository {
  getUsersById(userIds: string[]): Promise<User[]>;
}
