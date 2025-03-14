import { User } from '@/core/domain/user/user';
import { RemainingPromptsDto } from '@/core/application/user/dto/remaining-prompts.dto';

export interface UserService {
  create(user: User): Promise<User>; // TODO: service should receive DTO not domain entities

  getUserIdByEmail(email: string): Promise<string | undefined>;

  getUserByEmail(email: string): Promise<User | undefined>;

  checkIfExists(userId: string): Promise<boolean>;

  getUserRemainingPromptsByEvent(
    eventId: string,
    userId: string
  ): Promise<RemainingPromptsDto>;
}

export const USER_SERVICE = Symbol('USER_SERVICE');
