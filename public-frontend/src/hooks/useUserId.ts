import { useState } from 'react';

export const STORAGE_USER_ID_KEY = 'user-id';

export const useUserId = () => {
  const [userId] = useState<string | null>(localStorage.getItem(STORAGE_USER_ID_KEY));

  return userId;
};
