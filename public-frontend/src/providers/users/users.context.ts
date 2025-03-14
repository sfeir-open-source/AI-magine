import { createContext } from 'react';
import { UserRepository } from '@/src/domain/UserRepository';

export const UsersContext = createContext<UserRepository | null>(null);
