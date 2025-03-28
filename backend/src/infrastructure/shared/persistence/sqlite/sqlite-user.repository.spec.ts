import { SQLiteClient } from '@/infrastructure/shared/persistence/sqlite/sqlite-client';
import { SqliteUserRepository } from '@/infrastructure/shared/persistence/sqlite/sqlite-user.repository';
import { ConfigurationService } from '@/infrastructure/shared/configuration/configuration.service';
import { User } from '@/core/domain/user/user';

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
    sqliteClient = new SQLiteClient({
      getSqliteDBPath: vi.fn().mockReturnValue(':memory:'),
    } as unknown as ConfigurationService);
    repository = new SqliteUserRepository(sqliteClient);
    await repository.onApplicationBootstrap();
  });

  describe('getUserIdByEmail', () => {
    it('should return the user ID when the email exists in the database', async () => {
      vi.spyOn(sqliteClient, 'get').mockResolvedValue({
        id: mockUser.id,
        hashedEmail: mockUser.email,
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
        hashedEmail: mockUser.email,
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

  describe('getUserByUserName', () => {
    it('should return the user when the username exists in the database', async () => {
      vi.spyOn(sqliteClient, 'get').mockResolvedValue({
        id: mockUser.id,
        nickname: mockUser.nickname,
        hashedEmail: mockUser.email,
        browserFingerprint: mockUser.browserFingerprint,
        allowContact: mockUser.allowContact,
      });

      const result = await repository.getUserByUserName(mockUser.nickname);
      expect(result).toEqual(mockUser);
      expect(sqliteClient.get).toHaveBeenCalledWith({
        sql: expect.stringContaining(
          'SELECT id, nickname, hashedEmail, browserFingerprint, allowContact'
        ),
        params: { 1: mockUser.nickname },
      });
    });

    it('should return undefined when the username does not exist in the database', async () => {
      vi.spyOn(sqliteClient, 'get').mockResolvedValue(undefined);

      const result = await repository.getUserByUserName(mockUser.nickname);
      expect(result).toBeUndefined();
      expect(sqliteClient.get).toHaveBeenCalledWith({
        sql: expect.stringContaining(
          'SELECT id, nickname, hashedEmail, browserFingerprint, allowContact'
        ),
        params: { 1: mockUser.nickname },
      });
    });
  });

  describe('countUsersByEvent', () => {
    it('should return the count of users by event', async () => {
      vi.spyOn(sqliteClient, 'get').mockResolvedValue({ count: 2 });

      const result = await repository.countUsersByEvent('event-id');

      expect(result).toEqual(2);
      expect(sqliteClient.get).toHaveBeenCalled();
    });
  });
});
