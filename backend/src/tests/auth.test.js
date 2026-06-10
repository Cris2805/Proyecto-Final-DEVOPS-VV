import request from 'supertest';
import app from '../app.js';

describe('TaskFlow Auth API', () => {
  test('POST /api/auth/login permite inicio de sesión con credenciales correctas', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'carlos@taskflow.com',
        password: '123456'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Inicio de sesión correcto');
    expect(response.body.data.email).toBe('carlos@taskflow.com');
    expect(response.body.data.password).toBeUndefined();
  });

  test('POST /api/auth/login rechaza credenciales incorrectas', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'carlos@taskflow.com',
        password: 'incorrecta'
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Credenciales incorrectas');
  });

  test('GET /api/auth/users lista usuarios sin exponer contrasenas', async () => {
    const response = await request(app).get('/api/auth/users');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    expect(response.body.data[0].password).toBeUndefined();
  });
});
