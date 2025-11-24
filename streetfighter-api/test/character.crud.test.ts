import request from 'supertest';
import app from '../src/app';

describe('Character CRUD (light)', () => {
  const base = '/api/v1/characters';
  const testId = `testchar-${Date.now()}`;

  test('GET all characters returns 200 and contains array', async () => {
    const res = await request(app).get(base);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('characters');
    expect(Array.isArray(res.body.characters)).toBe(true);
  });

  test('GET unknown character returns 404', async () => {
    const res = await request(app).get(`${base}/__not_exists__`);
    expect(res.status).toBe(404);
  });

  test('POST missing character returns 400', async () => {
    const res = await request(app).post(base).send({});
    expect(res.status).toBe(400);
  });

  test('POST create, GET, PUT update, DELETE sequence', async () => {
    // create
    const createRes = await request(app)
      .post(base)
      .send({ character: testId, url: 'http://example.com/test' });
    expect(createRes.status).toBe(201);
    expect(createRes.body).toHaveProperty('character', testId);

    // get
    const getRes = await request(app).get(`${base}/${testId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body).toHaveProperty('character', testId);

    // update
    const updateRes = await request(app)
      .put(`${base}/${testId}`)
      .send({ url: 'http://example.com/updated' });
    expect([200, 201]).toContain(updateRes.status);
    expect(updateRes.body).toHaveProperty('url', 'http://example.com/updated');

    // delete
    const delRes = await request(app).delete(`${base}/${testId}`);
    expect([200, 204]).toContain(delRes.status);

    // confirm deleted
    const getAfter = await request(app).get(`${base}/${testId}`);
    expect(getAfter.status).toBe(404);
  });
});

describe('Stats endpoints (light)', () => {
  test('GET /api/v1/stats/top-damage returns 200 and results array', async () => {
    const res = await request(app).get('/api/v1/stats/top-damage?limit=5');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('results');
    expect(Array.isArray(res.body.results)).toBe(true);
  });

  test('GET /api/v1/stats/top-average-damage returns 200', async () => {
    const res = await request(app).get('/api/v1/stats/top-average-damage?limit=5');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('results');
  });
});
