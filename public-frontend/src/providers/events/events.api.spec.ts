import nock from 'nock';
import { eventsApi } from '@/src/providers/events/events.api';
import { Event } from '@/src/domain/Event';
import { Mock } from 'vitest';
import { Image } from '@/src/domain/Image';
import {
  CreateEventPromptRequest,
  CreateEventUserRequest,
} from '@/src/domain/EventRepository';

const apiMock = nock(import.meta.env.VITE_BACKEND_API_URL);

describe('EventsApi', () => {
  describe('createUserForEvent', () => {
    it('calls backend api to create a user for an event', async () => {
      const mockUserResponse = {
        id: 'user-id',
      };
      const createUserPayload: CreateEventUserRequest = {
        userEmail: 'email',
        userNickname: 'nickname',
        browserFingerprint: 'fp',
        allowContact: false,
      };

      apiMock.post(`/users`).reply(200, mockUserResponse);

      const result = await eventsApi.createUserForEvent(createUserPayload);

      expect(result.id).toEqual(mockUserResponse.id);
    });

    it('throws an error if the call fails', async () => {
      const createUserPayload: CreateEventUserRequest = {
        userEmail: 'email',
        userNickname: 'nickname',
        browserFingerprint: 'fp',
        allowContact: false,
      };

      apiMock.post(`/users`).reply(500);

      await expect(() =>
        eventsApi.createUserForEvent(createUserPayload)
      ).rejects.toThrow();
    });
  });

  describe('getEventById', () => {
    it('calls backend api to get event and map it to an Event instance', async () => {
      const mockEventResponse = {
        name: 'Test event',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
      };
      const eventId = 'identifier';

      apiMock.get(`/events/${eventId}`).reply(200, mockEventResponse);

      const result = await eventsApi.getEventById(eventId);

      expect(result).toBeInstanceOf(Event);
      expect(result.name).toEqual(mockEventResponse.name);
      expect(result.startDate).toEqual(mockEventResponse.startDate);
      expect(result.endDate).toEqual(mockEventResponse.endDate);
    });

    it('throws an error if the call fails', async () => {
      const eventId = 'identifier';

      apiMock.get(`/events/${eventId}`).reply(500);

      await expect(() => eventsApi.getEventById(eventId)).rejects.toThrow();
    });
  });

  describe('sendPromptForEvent', () => {
    it('calls backend api to send a new prompt for an event', async () => {
      const fakeEventPromptResponse = {
        id: 'fake-prompt-id',
      };

      const fakeUserId = 'fake-user-id';
      const fakeEventId = 'identifier';
      const fakePayload: CreateEventPromptRequest = {
        eventId: fakeEventId,
        userId: fakeUserId,
        prompt: 'prompt',
      };

      apiMock
        .post(`/events/${fakeEventId}/prompts`)
        .reply(200, fakeEventPromptResponse);

      const result = await eventsApi.sendPromptForEvent(fakePayload);

      expect(result).toEqual({
        promptId: fakeEventPromptResponse.id,
      });
    });

    it('throws an error if the call fails', async () => {
      const fakeEventId = 'identifier';
      const fakePayload: CreateEventPromptRequest = {
        userId: 'id',
        prompt: 'prompt',
        eventId: fakeEventId,
      };

      apiMock.post(`/events/${fakeEventId}/prompts`).reply(500);

      await expect(() =>
        eventsApi.sendPromptForEvent(fakePayload)
      ).rejects.toThrow();
    });
  });

  describe('listenForPromptGenerationEvent', () => {
    it('creates an EventSource and handle incoming messages', () => {
      const eventId = '123';
      const promptId = '456';
      const mockCallback = vi.fn();

      eventsApi.listenForPromptGenerationEvent(eventId, promptId, mockCallback);

      expect(EventSource).toHaveBeenCalledWith(
        `${import.meta.env.VITE_BACKEND_API_URL}/events/${eventId}/prompts/${promptId}`
      );

      const mockEvent = new MessageEvent('message', { data: 'test data' });
      const eventSourceInstance = (EventSource as unknown as Mock).mock
        .instances[0];

      eventSourceInstance.onmessage(mockEvent);

      expect(mockCallback).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('getImagesForUser', () => {
    it('calls backend api to retrieve user images', async () => {
      const fakeEventId = 'fake-event-id';
      const fakeUserId = 'fake-user-id';

      const fakeResponse = [
        {
          id: 'fake-image-id',
          url: 'http://foo',
          prompt: 'prompt',
          selected: false,
        },
      ];

      apiMock
        .get(`/events/${fakeEventId}/users/${fakeUserId}/images`)
        .reply(200, fakeResponse);

      const result = await eventsApi.getImagesForUser(fakeEventId, fakeUserId);

      expect(result).toEqual([
        new Image('fake-image-id', 'prompt', 'http://foo', false),
      ]);
    });

    it('throws an error if the call fails', async () => {
      const fakeEventId = 'fake-event-id';
      const fakeUserId = 'fake-user-id';

      apiMock
        .get(`/events/${fakeEventId}/users/${fakeUserId}/images`)
        .reply(500);

      await expect(() =>
        eventsApi.getImagesForUser(fakeEventId, fakeUserId)
      ).rejects.toThrow();
    });
  });

  describe('promoteUserImage', () => {
    it('calls backend api to promote an image', async () => {
      const fakeEventId = 'fake-event-id';
      const fakeUserId = 'fake-user-id';
      const fakeImageId = 'fake-image-id';

      const apiCall = apiMock
        .patch(
          `/events/${fakeEventId}/users/${fakeUserId}/images/${fakeImageId}/promote`
        )
        .reply(200);

      await eventsApi.promoteUserImage(fakeEventId, fakeUserId, fakeImageId);

      expect(apiCall.isDone()).toEqual(true);
    });

    it('throws an error if the call fails', async () => {
      const fakeEventId = 'fake-event-id';
      const fakeUserId = 'fake-user-id';
      const fakeImageId = 'fake-image-id';

      apiMock
        .patch(
          `/events/${fakeEventId}/users/${fakeUserId}/images/${fakeImageId}/promote`
        )
        .reply(500);

      await expect(() =>
        eventsApi.promoteUserImage(fakeEventId, fakeUserId, fakeImageId)
      ).rejects.toThrow();
    });
  });
});
