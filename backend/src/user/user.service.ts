import { Inject, Injectable } from '@nestjs/common';
import { User, USER_REPOSITORY, UserRepository } from '@/user/domain';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository
  ) {}

  async create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async getUserIdByEmail(email: string): Promise<string | undefined> {
    return this.userRepository.getUserIdByEmail(email);
  }
}
