import { renderHook } from '@testing-library/react';
import Cookies from 'js-cookie';
import { expect, Mock } from 'vitest';
import { USER_ID_COOKIE_NAME, useUserId } from '@/src/hooks/useUserId';

vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn()
  }
}))

describe('useUserId', () => {
  it('returns userId cookie value', () => {
    (Cookies.get as Mock).mockReturnValue('user-id');

    const {result} = renderHook(() => useUserId());

    expect(Cookies.get).toHaveBeenCalledWith(USER_ID_COOKIE_NAME);
    expect(result.current).toEqual('user-id')
  })
})