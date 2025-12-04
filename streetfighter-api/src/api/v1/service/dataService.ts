import { CollectionReference, Firestore } from 'firebase-admin/firestore';
import { db } from '../../../config/firebaseConfig';
import { dataStore } from '../../../utils/dataLoader';
import { Character } from '../models/characterModel';

const collectionName = process.env.FIRESTORE_COLLECTION || 'characters';

function getCollection(): CollectionReference | null {
  try {
    if (!db) return null;
    return db.collection(collectionName) as CollectionReference;
  } catch (err) {
    return null;
  }
}

async function getAll(): Promise<Character[]> {
  const col = getCollection();
  if (!col) {
    return Promise.resolve(dataStore.getAll());
  }

  const snapshot = await col.get();
  const items: Character[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data() as Character;
    items.push(data);
  });
  return items;
}

async function getById(id: string): Promise<Character | undefined> {
  const col = getCollection();
  if (!col) return Promise.resolve(dataStore.getById(id));

  const doc = await col.doc(id).get();
  if (!doc.exists) return undefined;
  return doc.data() as Character;
}

async function create(payload: Partial<Character>): Promise<Character> {
  const col = getCollection();
  if (!col) return Promise.resolve(dataStore.create(payload));

  const id = (payload.character || `${Date.now()}`) as string;
  const docRef = col.doc(id);
  const item = { ...(payload as Character), character: id } as Character;
  await docRef.set(item, { merge: true });
  return item;
}

async function update(id: string, payload: Partial<Character>): Promise<Character | null> {
  const col = getCollection();
  if (!col) return Promise.resolve(dataStore.update(id, payload));

  const docRef = col.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;
  const updated = { ...(doc.data() as Character), ...(payload as Partial<Character>) } as Character;
  await docRef.set(updated, { merge: true });
  return updated;
}

async function remove(id: string): Promise<boolean> {
  const col = getCollection();
  if (!col) return Promise.resolve(dataStore.delete(id));

  const docRef = col.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return false;
  await docRef.delete();
  return true;
}

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};
