// Mock authenticate middleware to simulate auth without Firebase
jest.mock('../src/api/v1/middleware/authenticate', () => ({
  __esModule: true,
  default: (req: any, res: any, next: any) => {
    const authHeader = req.headers?.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    // Accept a test token 'Bearer admin' as admin user
    if (authHeader === 'Bearer admin') {
      res.locals = res.locals || {};
      res.locals.role = 'admin';
      return next();
    }
    res.locals = res.locals || {};
    res.locals.role = 'user';
    return next();
  }
}));

// Also mock dataService write methods to avoid touching Firestore
jest.mock('../src/api/v1/service/dataService', () => ({
  __esModule: true,
  default: {
    create: jest.fn(async (p: any) => ({ ...p })),
    update: jest.fn(async (id: string, p: any) => ({ ...(p as any), character: id })),
    remove: jest.fn(async (id: string) => true),
  },
}));

import request from 'supertest';
import app from '../src/app';

describe('Characters - auth protection (mocked)', () => {
  it('POST /api/v1/characters is protected and returns 401 without token', async () => {
    const res = await request(app).post('/api/v1/characters').send({ character: 'testchar' });
    expect(res.status).toBe(401);
  });

  it('PUT /api/v1/characters/:id is protected and returns 401 without token', async () => {
    const res = await request(app).put('/api/v1/characters/test').send({});
    expect(res.status).toBe(401);
  });

  it('DELETE /api/v1/characters/:id is protected and returns 401 without token', async () => {
    const res = await request(app).delete('/api/v1/characters/test');
    expect(res.status).toBe(401);
  });

  it('POST /api/v1/characters with admin token succeeds (mocked)', async () => {
    const res = await request(app)
      .post('/api/v1/characters')
      .set('Authorization', 'Bearer admin')
      .send({ character: 'testchar' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('character', 'testchar');
  });
});
