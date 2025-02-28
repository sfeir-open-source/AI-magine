import { renderHook } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import { STORAGE_USER_ID_KEY, useUserId } from '@/src/hooks/useUserId';

vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('useUserId', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('returns userId cookie value', () => {
    localStorage.setItem(STORAGE_USER_ID_KEY, 'user-id');

    const { result } = renderHook(() => useUserId());

    expect(result.current).toEqual('user-id');
  });
});
