export interface UserRepository {
  getRemainingPromptsCountForUserAndEvent(
    userId: string,
    eventId: string
  ): Promise<number>;
}
