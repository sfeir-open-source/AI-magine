import nock from 'nock';
import { eventsApi } from '@/src/providers/events/events.api';
import { Event } from '@/src/domain/Event';
import { expect } from 'vitest';

const apiMock = nock(import.meta.env.VITE_BACKEND_API_URL);

describe('EventsApi', () => {
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

  describe('getAllEvents', () => {
    it('calls backend api to get all events and map them to an Event instance', async () => {
      const mockEventResponse = [
        {
          name: 'Test event',
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
        },
      ];

      apiMock.get(`/events`).reply(200, mockEventResponse);

      const result = await eventsApi.getAllEvents();

      expect(result[0]).toBeInstanceOf(Event);
      expect(result[0].name).toEqual(mockEventResponse[0].name);
      expect(result[0].startDate).toEqual(mockEventResponse[0].startDate);
      expect(result[0].endDate).toEqual(mockEventResponse[0].endDate);
    });

    it('throws an error if the call fails', async () => {
      apiMock.get(`/events`).reply(500);

      await expect(() => eventsApi.getAllEvents()).rejects.toThrow();
    });
  });

  describe('createEvent', () => {
    it('calls backend api create an event', async () => {
      const mockEventResponse = {
        id: '1',
        name: 'Test event',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
      };

      apiMock.post(`/events`).reply(200, mockEventResponse);

      const result = await eventsApi.createEvent({
        name: mockEventResponse.name,
        startDateTimestamp: 1,
        endDateTimestamp: 2,
      });

      expect(result).toBeInstanceOf(Event);
      expect(result.name).toEqual(mockEventResponse.name);
      expect(result.startDate).toEqual(mockEventResponse.startDate);
      expect(result.endDate).toEqual(mockEventResponse.endDate);
    });

    it('throws an error if the call fails', async () => {
      apiMock.post(`/events`).reply(500);

      await expect(() =>
        eventsApi.createEvent({
          name: 'event',
          startDateTimestamp: 1,
          endDateTimestamp: 2,
        })
      ).rejects.toThrow();
    });
  });

  describe('getPromotedImagesForEvent', () => {
    it('calls backend api to get promoted images', async () => {
      const fakeEventId = 'fake-event-id';
      const fakeImage = {
        id: 'fake-image-id',
        prompt: 'test prompt',
        url: 'url',
        author: 'author',
      };

      apiMock
        .get(`/events/${fakeEventId}/images/promoted`)
        .reply(200, [fakeImage]);

      const result = await eventsApi.getPromotedImagesForEvent(fakeEventId);

      expect(result).toEqual([fakeImage]);
    });

    it('throws an error if the call fails', async () => {
      const fakeEventId = 'fake-event-id';

      apiMock.get(`/events/${fakeEventId}/images/promoted`).reply(500);

      await expect(() =>
        eventsApi.getPromotedImagesForEvent(fakeEventId)
      ).rejects.toThrow();
    });
  });
});
