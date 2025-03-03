import { beforeEach, vi } from 'vitest';
import { SQLiteClient } from '@/config/sqlite-client';
import { SqliteUserRepository } from '@/user/sqlite.user.repository';
import { User } from '@/user/user-types';

vi.mock('./sqlite.user.repository', async () => {
  const originalModule = await vi.importActual<
    typeof import('./sqlite.user.repository')
  >('./sqlite.user.repository');
  return {
    ...originalModule,
    SQLiteClient: vi.fn().mockImplementation(() => ({
      run: vi.fn(),
      get: vi.fn(),
      all: vi.fn(),
      close: vi.fn(),
      serialize: vi.fn(),
    })),
  };
});

const mockUser = User.from(
  '2',
  'hashedEmail',
  'fingerprint',
  true,
  'Name',
  'Job'
);

describe('SqliteUserRepository', () => {
  let sqliteClient: SQLiteClient;
  let repository: SqliteUserRepository;

  beforeEach(() => {
    sqliteClient = new SQLiteClient();
    repository = new SqliteUserRepository(sqliteClient);
  });

  describe('getUserIdByEmail', () => {
    it('should return the user ID when the email exists in the database', async () => {
      vi.spyOn(sqliteClient, 'get').mockResolvedValue({ id: mockUser.id });

      const result = await repository.getUserIdByEmail(mockUser.hashedEmail);
      expect(result).toBe(mockUser.id);
      expect(sqliteClient.get).toHaveBeenCalled();
    });

    it('should return undefined when the email does not exist in the database', async () => {
      vi.spyOn(sqliteClient, 'get').mockResolvedValue(undefined);

      const result = await repository.getUserIdByEmail(mockUser.hashedEmail);
      expect(result).toBeUndefined();
      expect(sqliteClient.get).toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save the user to the database and return the saved user', async () => {
      vi.spyOn(sqliteClient, 'run');
      const result = await repository.save(mockUser);

      expect(result).toEqual(mockUser);
      expect(sqliteClient.run).toHaveBeenCalled();
    });
  });

  describe('checkExists', () => {
    it('should return true if a user with the same email or fingerprint exists', async () => {
      vi.spyOn(sqliteClient, 'get').mockResolvedValue({
        email: mockUser.hashedEmail,
        browserFingerprint: mockUser.browserFingerprint,
      });

      const user = User.create('hashedEmail', 'fingerprint', true);
      const result = await repository.checkExists(user);

      expect(result).toBe(true);
      expect(sqliteClient.get).toHaveBeenCalled();
    });

    it('should return false if no user with the same email or fingerprint exists', async () => {
      vi.spyOn(sqliteClient, 'get').mockResolvedValue(undefined);

      const user = User.create('hashedEmail', 'fingerprint', true);
      const result = await repository.checkExists(user);

      expect(result).toBe(false);
      expect(sqliteClient.get).toHaveBeenCalled();
    });
  });
});
