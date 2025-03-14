import nock from 'nock';
import { usersApi } from '@/src/providers/users/users.api';

const apiMock = nock(import.meta.env.VITE_BACKEND_API_URL);

describe('UsersApi', () => {
  describe('getRemainingPromptsCountForUserAndEvent', () => {
    it('calls api to get remaining prompts', async () => {
      const fakeUserId = 'user-id';
      const fakeEventId = 'event-id';

      apiMock
        .get(`/users/${fakeUserId}/events/${fakeEventId}/prompts/remaining`)
        .reply(200, { remaining: 5 });

      const result = await usersApi.getRemainingPromptsCountForUserAndEvent(
        fakeUserId,
        fakeEventId
      );

      expect(result).toEqual(5);
    });

    it('throws an error if call fails', async () => {
      const fakeUserId = 'user-id';
      const fakeEventId = 'event-id';

      apiMock
        .get(`/users/${fakeUserId}/events/${fakeEventId}/prompts/remaining`)
        .reply(500);

      await expect(() =>
        usersApi.getRemainingPromptsCountForUserAndEvent(
          fakeUserId,
          fakeEventId
        )
      ).rejects.toThrow();
    });
  });
});
