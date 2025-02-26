import Cookies from 'js-cookie';
import { useState } from 'react';

export const USER_ID_COOKIE_NAME = 'userId';

export const useUserId = () => {
  const [userId] = useState<string | undefined>(Cookies.get(USER_ID_COOKIE_NAME));

  return userId;
};
