import { useContext } from 'react';
import { UsersContext } from '@/src/providers/users/users.context';

export const useUsersProvider = () => {
  const usersProvider = useContext(UsersContext);

  if (!usersProvider) {
    throw new Error('Missing events provider implementation in UsersContext');
  }

  return usersProvider;
};
