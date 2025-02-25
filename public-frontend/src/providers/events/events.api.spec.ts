import nock from 'nock';
import { eventsApi } from '@/src/providers/events/events.api';
import { Event } from '@/src/domain/Event';
import { NewEventPromptRequestBody } from '@/src/domain/EventRepository';

const apiMock = nock(import.meta.env.VITE_BACKEND_API_URL);

describe('EventsApi', () => {
  describe('getEventById', () => {
    it('calls backend api to get event and map it to an Event instance', async () => {
      const mockEventResponse = {
        name: 'Test event',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
      };
      const eventId = 'identifier'

      apiMock.get(`/events/${eventId}`).reply(200, mockEventResponse);

      const result = await eventsApi.getEventById(eventId);

      expect(result).toBeInstanceOf(Event);
      expect(result.name).toEqual(mockEventResponse.name);
      expect(result.startDate).toEqual(mockEventResponse.startDate);
      expect(result.endDate).toEqual(mockEventResponse.endDate);
    });

    it('throws an error if the call fails', async () => {
      const eventId = 'identifier'

      apiMock.get(`/events/${eventId}`).reply(500);

      await expect(() => eventsApi.getEventById(eventId)).rejects.toThrow();
    });
  });

  describe('sendPromptForEvent', () => {
    it('calls backend api to send a new prompt for an event', async () => {
      const fakeEventPromptResponse = { promptId: 'fake-prompt-id' };
      const fakeEventId = 'identifier'
      const fakePayload: NewEventPromptRequestBody = {
        userEmail: 'email',
        userName: 'name',
        jobTitle: 'job',
        allowContact: false,
        prompt: 'prompt',
        browserFingerprint: 'fingerprint',
      }

      apiMock.post(`/events/${fakeEventId}/prompt`).reply(200, fakeEventPromptResponse);

      const result = await eventsApi.sendPromptForEvent(fakeEventId, fakePayload);

      expect(result).toEqual(fakeEventPromptResponse.promptId);
    })

    it('throws an error if the call fails', async () => {
      const fakeEventId = 'identifier'
      const fakePayload: NewEventPromptRequestBody = {
        userEmail: 'email',
        userName: 'name',
        jobTitle: 'job',
        allowContact: false,
        prompt: 'prompt',
        browserFingerprint: 'fingerprint',
      }

      apiMock.post(`/events/${fakeEventId}/prompts`).reply(500);

      await expect(() => eventsApi.sendPromptForEvent(fakeEventId, fakePayload)).rejects.toThrow();
    });
  })
});
