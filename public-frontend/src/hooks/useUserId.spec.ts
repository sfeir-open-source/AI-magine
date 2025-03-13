import { STORAGE_USER_ID_KEY, useUserId } from '@/src/hooks/useUserId';
import { renderHook } from '@testing-library/react';

describe('useUserId', () => {
  it('returns userId from sessionStorage', () => {
    const fakeUserId = 'fake-id';
    sessionStorage.setItem(STORAGE_USER_ID_KEY, fakeUserId);

    const { result } = renderHook(() => useUserId());

    expect(result.current).toEqual(fakeUserId);
  });
});
