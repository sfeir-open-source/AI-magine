import { SQLiteClient } from '@/config/sqlite-client';
import { SqliteUserRepository } from '@/user/sqlite.user.repository';
import { User } from '@/user/domain';

const mockUser = User.from({
  id: '2',
  email: 'email',
  browserFingerprint: 'fingerprint',
  allowContact: true,
  nickname: 'Nickname',
});

describe('SqliteUserRepository', () => {
  let sqliteClient: SQLiteClient;
  let repository: SqliteUserRepository;

  beforeEach(async () => {
    sqliteClient = new SQLiteClient();
    repository = new SqliteUserRepository(sqliteClient);
    await repository.onApplicationBootstrap();
  });

  describe('getUserIdByEmail', () => {
    it('should return the user ID when the email exists in the database', async () => {
      vi.spyOn(sqliteClient, 'get').mockResolvedValue({
        id: mockUser.id,
        email: mockUser.email,
        nickname: mockUser.email,
        browserFingerprint: mockUser.browserFingerprint,
        allowContact: mockUser.allowContact,
      });

      const result = await repository.getUserIdByEmail(mockUser.email);
      expect(result).toBe(mockUser.id);
      expect(sqliteClient.get).toHaveBeenCalled();
    });

    it('should return undefined when the email does not exist in the database', async () => {
      vi.spyOn(sqliteClient, 'get').mockResolvedValue(undefined);

      const result = await repository.getUserIdByEmail(mockUser.email);
      expect(result).toBeUndefined();
      expect(sqliteClient.get).toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save the user to the database and return the saved user', async () => {
      vi.spyOn(sqliteClient, 'run').mockResolvedValue('ok');
      const result = await repository.save(mockUser);

      expect(result).toEqual(mockUser);
      expect(sqliteClient.run).toHaveBeenCalled();
    });
  });

  describe('checkExistsById', () => {
    it('should return true if a user with the same email or fingerprint exists', async () => {
      vi.spyOn(sqliteClient, 'get').mockResolvedValue({
        email: mockUser.email,
        browserFingerprint: mockUser.browserFingerprint,
      });

      const userId = 'userId';
      const result = await repository.checkExistsById(userId);

      expect(result).toBe(true);
      expect(sqliteClient.get).toHaveBeenCalled();
    });

    it('should return false if no user with the same email or fingerprint exists', async () => {
      vi.spyOn(sqliteClient, 'get').mockResolvedValue(undefined);

      const userId = 'userId';
      const result = await repository.checkExistsById(userId);

      expect(result).toBe(false);
      expect(sqliteClient.get).toHaveBeenCalled();
    });
  });

  describe('getUserByEmail', () => {
    it('should return the user when the email exists in the database', async () => {
      vi.spyOn(sqliteClient, 'get').mockResolvedValue({
        id: mockUser.id,
        email: mockUser.email,
        nickname: mockUser.nickname,
        browserFingerprint: mockUser.browserFingerprint,
        allowContact: mockUser.allowContact,
      });

      const result = await repository.getUserByEmail(mockUser.email);
      expect(result).toEqual(mockUser);
      expect(sqliteClient.get).toHaveBeenCalled();
    });

    it('should return undefined when the email does not exist in the database', async () => {
      vi.spyOn(sqliteClient, 'get').mockResolvedValue(undefined);

      const result = await repository.getUserByEmail(mockUser.email);
      expect(result).toBeUndefined();
      expect(sqliteClient.get).toHaveBeenCalled();
    });
  });
});
