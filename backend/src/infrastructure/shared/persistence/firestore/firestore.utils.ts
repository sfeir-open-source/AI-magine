import {
  CollectionReference,
  Query,
  QueryDocumentSnapshot,
} from '@google-cloud/firestore';

export const fetchDocumentsByChunks = async (
  collection: CollectionReference,
  field: string,
  values: string[],
  additionalFilters: [
    string,
    FirebaseFirestore.WhereFilterOp,
    string | number | boolean,
  ][] = []
): Promise<QueryDocumentSnapshot[]> => {
  const chunkSize = 30;
  const snapshots: QueryDocumentSnapshot[] = [];

  for (let i = 0; i < values.length; i += chunkSize) {
    const chunk = values.slice(i, i + chunkSize);
    let query: Query = collection.where(field, 'in', chunk);

    for (const [filterField, op, filterValue] of additionalFilters) {
      query = query.where(filterField, op, filterValue);
    }

    const querySnapshot = await query.get();
    querySnapshot.forEach((doc) => snapshots.push(doc));
  }

  return snapshots;
};
