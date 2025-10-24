import { test, expect } from '@playwright/test';

const API_BASE_URL = 'http://localhost:8000';

test.describe('NoteDrop - API Tests', () => {
  
  test('GET /api/messages/ should return list of messages', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/messages/`);
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('POST /api/messages/ should create a new message', async ({ request }) => {
    const newMessage = {
      content: `E2E Test Message ${Date.now()}`
    };

    const response = await request.post(`${API_BASE_URL}/api/messages/`, {
      data: newMessage,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const data = await response.json();
    expect(data.content).toBe(newMessage.content);
    expect(data.id).toBeDefined();
    expect(data.created_at).toBeDefined();
  });

  test('POST /api/messages/ should reject empty content', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/messages/`, {
      data: { content: '' },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.status()).toBe(400);
  });

  test('GET /api/messages/export.xlsx should return Excel file', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/messages/export.xlsx`);
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('spreadsheetml');
    
    const contentDisposition = response.headers()['content-disposition'];
    expect(contentDisposition).toContain('attachment');
    expect(contentDisposition).toContain('.xlsx');
  });

  test('GET / should return Swagger UI', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/`);
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const html = await response.text();
    expect(html).toContain('swagger');
  });

  test('GET /api/schema/ should return OpenAPI schema', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/schema/`);
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/vnd.oai.openapi');
    
    const body = await response.text();
    expect(body.length).toBeGreaterThan(0);
    
    if (contentType.includes('json')) {
      const schema = JSON.parse(body);
      expect(schema.openapi || schema.swagger).toBeDefined();
      expect(schema.info).toBeDefined();
      expect(schema.paths).toBeDefined();
    }
  });

  test('API should handle CORS correctly', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/messages/`, {
      headers: {
        'Origin': 'http://localhost:3000'
      }
    });

    expect(response.ok()).toBeTruthy();
  });

  test('should create and retrieve message in sequence', async ({ request }) => {
    const newMessage = {
      content: `Sequential Test ${Date.now()}`
    };

    const createResponse = await request.post(`${API_BASE_URL}/api/messages/`, {
      data: newMessage,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(createResponse.status()).toBe(201);
    const createdMessage = await createResponse.json();

    const getResponse = await request.get(`${API_BASE_URL}/api/messages/`);
    const messages = await getResponse.json();

    const foundMessage = messages.find((m: any) => m.id === createdMessage.id);
    expect(foundMessage).toBeDefined();
    expect(foundMessage.content).toBe(newMessage.content);
  });

  test('should handle large message content', async ({ request }) => {
    const largeContent = 'x'.repeat(5000);
    
    const response = await request.post(`${API_BASE_URL}/api/messages/`, {
      data: { content: largeContent },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.content.length).toBe(5000);
  });

  test('should return messages ordered by newest first', async ({ request }) => {
    await request.post(`${API_BASE_URL}/api/messages/`, {
      data: { content: 'First message' }
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    await request.post(`${API_BASE_URL}/api/messages/`, {
      data: { content: 'Second message' }
    });

    const response = await request.get(`${API_BASE_URL}/api/messages/`);
    const messages = await response.json();

    if (messages.length >= 2) {
      const firstDate = new Date(messages[0].created_at);
      const secondDate = new Date(messages[1].created_at);
      expect(firstDate.getTime()).toBeGreaterThanOrEqual(secondDate.getTime());
    }
  });
});
