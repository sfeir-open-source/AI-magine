import { User } from '@/user/domain/user.domain';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  checkExists(user: User): Promise<boolean>;

  save(user: User): Promise<User>;

  getUserIdByEmail(email: string): Promise<string | undefined>;
}
