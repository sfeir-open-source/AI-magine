import { SfeirEvent } from '@/events/events-types';

describe('SfeirEvent', () => {
  const id = 'test-id';
  const name = 'test-event';
  const validStartDate = new Date('2024-12-12T10:00:00Z');
  const validEndDate = new Date('2024-12-13T10:00:00Z');

  describe('from', () => {
    it('should create an instance of SfeirEvent from provided arguments', () => {
      const event = SfeirEvent.from(id, name, validStartDate, validEndDate);
      expect(event).toBeInstanceOf(SfeirEvent);
      expect(event.id).toBe(id);
      expect(event.name).toBe(name);
      expect(event.startDate).toEqual(validStartDate);
      expect(event.endDate).toEqual(validEndDate);
    });

    it('should throw an error if name is missing', () => {
      expect(() =>
        SfeirEvent.from(id, '', validStartDate, validEndDate)
      ).toThrow('Name is required');
    });

    it('should throw an error if startDate is missing', () => {
      expect(() =>
        SfeirEvent.from(id, name, null as unknown as Date, validEndDate)
      ).toThrow('Start date is required');
    });

    it('should throw an error if endDate is missing', () => {
      expect(() =>
        SfeirEvent.from(id, name, validStartDate, null as unknown as Date)
      ).toThrow('End date is required');
    });

    it('should throw an error if startDate is after endDate', () => {
      expect(() =>
        SfeirEvent.from(id, name, validEndDate, validStartDate)
      ).toThrow('Start date must be before end date');
    });
  });

  describe('create', () => {
    it('should create an instance of SfeirEvent with a generated id', () => {
      const event = SfeirEvent.create(name, validStartDate, validEndDate);
      expect(event).toBeInstanceOf(SfeirEvent);
      expect(event.id).toHaveLength(8);
      expect(event.name).toBe(name);
      expect(event.startDate).toEqual(validStartDate);
      expect(event.endDate).toEqual(validEndDate);
    });
  });

  describe('#isActive', () => {
    it('should return true if the current date is within the event boundaries', () => {
      const now = new Date();
      const startDate = new Date(now.getTime() - 1000);
      const endDate = new Date(now.getTime() + 1000);
      const event = SfeirEvent.create(name, startDate, endDate);

      expect(event.isActive()).toBe(true);
    });

    it('should return false if the current date is before the event boundaries', () => {
      const startDate = new Date(Date.now() + 1000);
      const endDate = new Date(Date.now() + 2000);
      const event = SfeirEvent.create(name, startDate, endDate);

      expect(event.isActive()).toBe(false);
    });

    it('should return false if the current date is after the event boundaries', () => {
      const startDate = new Date(Date.now() - 2000);
      const endDate = new Date(Date.now() - 1000);
      const event = SfeirEvent.create(name, startDate, endDate);

      expect(event.isActive()).toBe(false);
    });
  });
});
