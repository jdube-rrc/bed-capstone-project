// Mock the dataService so tests don't depend on Firestore
jest.mock('../src/api/v1/service/dataService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(async () => [
      { character: 'ryu', url: '/characters/ryu', scrapedAt: '2025-01-01', categories: [] }
    ]),
    getById: jest.fn(async (id: string) => (id === 'ryu' ? { character: 'ryu', url: '/characters/ryu' } : undefined)),
  },
}));

import request from 'supertest';
import app from '../src/app';

describe('Characters - public read endpoints (mocked)', () => {
  it('GET /api/v1/characters returns list with total', async () => {
    const res = await request(app).get('/api/v1/characters').expect(200);
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.characters)).toBe(true);
  });

  it('GET /api/v1/characters/:id returns a character when present', async () => {
    const res = await request(app).get('/api/v1/characters/ryu');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('character', 'ryu');
  });
});
