import { renderHook } from '@testing-library/react';
import { UsersContext } from '@/src/providers/users/users.context';
import { UserRepository } from '@/src/domain/UserRepository';
import { useUsersProvider } from '@/src/providers/users/useUsersProvider';

describe('useUsersProvider', () => {
  it('returns provided provider', () => {
    const fakeProvider = { getRemainingPromptsForUserAndEvent: vi.fn() };

    const { result } = renderHook(() => useUsersProvider(), {
      wrapper: ({ children }) => (
        <UsersContext.Provider
          value={fakeProvider as unknown as UserRepository}
        >
          {children}
        </UsersContext.Provider>
      ),
    });

    expect(result.current).toEqual(fakeProvider);
  });

  it('throws an error if no implementation found', () => {
    expect(() =>
      renderHook(() => useUsersProvider(), {
        wrapper: ({ children }) => (
          <UsersContext.Provider value={null}>{children}</UsersContext.Provider>
        ),
      })
    ).toThrow();
  });
});
