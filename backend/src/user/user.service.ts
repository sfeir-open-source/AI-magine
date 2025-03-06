import { Inject, Injectable } from '@nestjs/common';
import { User, USER_REPOSITORY, UserRepository } from '@/user/domain';
import { EncryptionService } from '@/user/encryption/encryption.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly encryptionService: EncryptionService
  ) {}

  async create(user: User): Promise<User> {
    return this.userRepository.save({
      ...user,
      email: this.encryptionService.encryptEmail(user.email),
    });
  }

  async getUserIdByEmail(email: string): Promise<string | undefined> {
    return this.userRepository.getUserIdByEmail(
      this.encryptionService.encryptEmail(email)
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.getUserByEmail(
      this.encryptionService.encryptEmail(email)
    );
  }

  async checkIfExists(userId: string): Promise<boolean> {
    return this.userRepository.checkExistsById(userId);
  }
}
