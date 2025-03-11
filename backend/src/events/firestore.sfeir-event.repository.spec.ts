import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
} from '@google-cloud/firestore';
import { FirestoreSfeirEventRepository } from '@/events/firestore.sfeir-event.repository';
import { FirestoreClient } from '@/config/firestore-client';
import { SfeirEvent } from '@/events/domain';

vi.mock('@google-cloud/firestore', async () => ({
  CollectionReference: vi.fn(),
}));

describe('FirestoreSfeirEventRepository', () => {
  let repository: FirestoreSfeirEventRepository;
  let firestoreClientMock: FirestoreClient;
  let collectionMock: CollectionReference;

  beforeEach(() => {
    collectionMock = {
      get: vi.fn(),
      doc: vi.fn(() => ({
        get: vi.fn(),
        set: vi.fn(),
        delete: vi.fn(),
      })),
    } as unknown as CollectionReference;

    firestoreClientMock = {
      getCollection: vi.fn().mockReturnValue(collectionMock),
    } as unknown as FirestoreClient;

    repository = new FirestoreSfeirEventRepository(firestoreClientMock);
  });

  it('should retrieve all Sfeir events', async () => {
    const mockData = {
      name: 'Event1',
      startDate: { _seconds: 1696540800 },
      endDate: { _seconds: 1696627200 },
    };
    const mockDocs = [
      {
        id: '1',
        get: (field: string) => {
          return mockData[field as keyof typeof mockData];
        },
      },
    ];
    vi.spyOn(collectionMock, 'get').mockResolvedValueOnce({
      docs: mockDocs,
    } as unknown as QuerySnapshot);

    const result = await repository.getSfeirEvents();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
    expect(result[0].name).toBe('Event1');
    expect(result[0].startDate).toEqual(new Date('2023-10-05T21:20:00.000Z'));
    expect(result[0].endDate).toEqual(new Date('2023-10-06T21:20:00.000Z'));
  });

  it('should save a Sfeir event', async () => {
    const sfeirEvent = SfeirEvent.create(
      'Test Event',
      new Date('2023-10-10T10:00:00Z'),
      new Date('2023-10-11T10:00:00Z')
    );
    const setMock = vi.fn();
    vi.spyOn(collectionMock, 'doc').mockReturnValueOnce({
      set: setMock,
    } as unknown as DocumentReference);

    const result = await repository.saveSfeirEvent(sfeirEvent);

    expect(collectionMock.doc).toHaveBeenCalledWith(sfeirEvent.id);
    expect(setMock).toHaveBeenCalledWith({
      name: sfeirEvent.name,
      allowedPrompts: sfeirEvent.allowedPrompts,
      startDate: sfeirEvent.startDate,
      endDate: sfeirEvent.endDate,
    });
    expect(result).toEqual(sfeirEvent);
  });

  it('should delete a Sfeir event by ID', async () => {
    const deleteMock = vi.fn();
    const getMock = vi
      .fn()
      .mockResolvedValueOnce({ exists: true, ref: { delete: deleteMock } });
    vi.spyOn(collectionMock, 'doc').mockReturnValueOnce({
      get: getMock,
    } as unknown as DocumentReference);

    await repository.deleteSfeirEvent('1');

    expect(collectionMock.doc).toHaveBeenCalledWith('1');
    expect(getMock).toHaveBeenCalled();
    expect(deleteMock).toHaveBeenCalled();
  });

  it('should throw an error when deleting a non-existing Sfeir event', async () => {
    const getMock = vi.fn().mockResolvedValueOnce({ exists: false });
    vi.spyOn(collectionMock, 'doc').mockReturnValueOnce({
      get: getMock,
    } as unknown as DocumentReference);

    await expect(repository.deleteSfeirEvent('non-existing')).rejects.toThrow(
      'No event found with id: non-existing'
    );

    expect(collectionMock.doc).toHaveBeenCalledWith('non-existing');
    expect(getMock).toHaveBeenCalled();
  });

  it('should retrieve a Sfeir event by ID', async () => {
    const mockData = {
      name: 'Event1',
      startDate: { _seconds: 1696540800 },
      endDate: { _seconds: 1696627200 },
    };
    const mockDoc = {
      exists: true,
      get: (field: keyof typeof mockData) => {
        return mockData[field];
      },
    } as unknown as DocumentSnapshot;
    vi.spyOn(collectionMock, 'doc').mockReturnValueOnce({
      get: vi.fn().mockResolvedValueOnce(mockDoc),
    } as unknown as DocumentReference);

    const result = await repository.getSfeirEvent('1');

    expect(result).toBeDefined();
    expect(result?.id).toBe('1');
    expect(result?.name).toBe('Event1');
    expect(result?.startDate).toEqual(new Date(1696540800 * 1000));
    expect(result?.endDate).toEqual(new Date(1696627200 * 1000));
  });

  it('should return undefined when retrieving a non-existing Sfeir event', async () => {
    const mockDoc = { exists: false } as unknown as DocumentSnapshot;
    vi.spyOn(collectionMock, 'doc').mockReturnValueOnce({
      get: vi.fn().mockResolvedValueOnce(mockDoc),
    } as unknown as DocumentReference);

    const result = await repository.getSfeirEvent('non-existing');

    expect(result).toBeUndefined();
    expect(collectionMock.doc).toHaveBeenCalledWith('non-existing');
  });
});
