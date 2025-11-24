import fs from 'fs';
import path from 'path';
import { Character } from '../api/v1/models/characterModel';

type Id = string;

class DataStore {
  private items: Character[] = [];

  constructor() {
    this.load();
  }

  private load() {
    // try multiple plausible locations for the data folder
    const tryPaths = [
      path.resolve(process.cwd(), 'data', 'all-characters.json'),
      path.resolve(process.cwd(), '..', 'data', 'all-characters.json'),
      path.resolve(__dirname, '..', '..', '..', 'data', 'all-characters.json')
    ];

    let content: string | null = null;
    for (const p of tryPaths) {
      if (fs.existsSync(p)) {
        content = fs.readFileSync(p, 'utf8');
        break;
      }
    }

    if (!content) {
      // no file found — start with empty store
      // eslint-disable-next-line no-console
      console.warn('all-characters.json not found in expected locations; starting with empty data store');
      this.items = [];
      return;
    }

    try {
      const obj = JSON.parse(content);
      if (Array.isArray(obj.characters)) {
        this.items = obj.characters as Character[];
      } else if (Array.isArray(obj)) {
        this.items = obj as Character[];
      } else {
        this.items = [];
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error parsing all-characters.json', err);
      this.items = [];
    }
  }

  getAll(): Character[] {
    return this.items;
  }

  getById(id: Id): Character | undefined {
    return this.items.find((c) => c.character === id || (c.character && c.character.toString() === id));
  }

  create(payload: Partial<Character>): Character {
    const id = (payload.character || `char-${Date.now()}`).toString();
    const item: Character = { ...payload, character: id } as Character;
    this.items.push(item);
    return item;
  }

  update(id: Id, payload: Partial<Character>): Character | null {
    const idx = this.items.findIndex((c) => c.character === id);
    if (idx === -1) return null;
    this.items[idx] = { ...this.items[idx], ...payload };
    return this.items[idx];
  }

  delete(id: Id): boolean {
    const idx = this.items.findIndex((c) => c.character === id);
    if (idx === -1) return false;
    this.items.splice(idx, 1);
    return true;
  }
}

export const dataStore = new DataStore();
