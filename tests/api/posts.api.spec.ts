import { test, expect } from '@playwright/test';

const resources = [
  { path: '/posts/1', field: 'title' as const },
  { path: '/users/1', field: 'name' as const },
  { path: '/comments/1', field: 'body' as const },
] as const;

test.describe('JSONPlaceholder API', () => {
  for (const row of resources) {
    test(`GET ${row.path} returns JSON with ${row.field}`, async ({ request }) => {
      const res = await request.get(row.path);
      expect(res.ok()).toBeTruthy();
      expect(res.headers()['content-type']).toMatch(/json/i);
      const body = (await res.json()) as Record<string, unknown>;
      expect(typeof body[row.field]).toBe('string');
      expect((body[row.field] as string).length).toBeGreaterThan(0);
    });
  }

  test('POST /posts creates resource (201)', async ({ request }) => {
    const res = await request.post('/posts', {
      data: { title: 'qa-starter', body: 'api smoke', userId: 1 },
    });
    expect([200, 201]).toContain(res.status());
    const body = (await res.json()) as { id?: number };
    expect(body.id).toBeDefined();
  });

  test('GET /posts/999999 returns 404', async ({ request }) => {
    const res = await request.get('/posts/999999');
    expect(res.status()).toBe(404);
  });
});
