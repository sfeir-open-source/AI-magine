import { useState } from 'react';

export const STORAGE_USER_ID_KEY = 'user-id';

export const useUserId = () => {
  const [userId] = useState(sessionStorage.getItem(STORAGE_USER_ID_KEY));

  return userId;
};
