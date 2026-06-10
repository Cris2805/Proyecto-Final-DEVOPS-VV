import request from 'supertest';
import app from '../app.js';

describe('TaskFlow modulos funcionales', () => {
  test('GET /api/users lista usuarios reales sin password', async () => {
    const response = await request(app).get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data[0].password).toBeUndefined();
  });

  test('POST /api/users crea usuario que puede iniciar sesion', async () => {
    const email = `qa${Date.now()}@taskflow.com`;

    const createResponse = await request(app).post('/api/users').send({
      name: 'Usuario QA',
      email,
      password: '123456',
      role: 'QA Engineer',
      department: 'Calidad',
      workload: 40,
      productivity: 70,
      assigned_tasks: 3
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data.email).toBe(email);
    expect(createResponse.body.data.password).toBeUndefined();

    const loginResponse = await request(app).post('/api/auth/login').send({
      email,
      password: '123456'
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.success).toBe(true);
  });

  test('GET /api/projects lista proyectos iniciales', async () => {
    const response = await request(app).get('/api/projects');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBeGreaterThanOrEqual(6);
  });

  test('POST /api/projects crea proyecto valido', async () => {
    const response = await request(app).post('/api/projects').send({
      name: `Proyecto QA ${Date.now()}`,
      description: 'Proyecto creado desde pruebas.',
      status: 'planificado',
      priority: 'media',
      progress: 10,
      owner: 'Usuario QA',
      due_date: '2026-07-20',
      category: 'QA'
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toContain('Proyecto QA');
  });

  test('GET /api/settings y PUT /api/settings funcionan', async () => {
    const getResponse = await request(app).get('/api/settings');
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.data.workspace_name).toBeTruthy();

    const putResponse = await request(app).put('/api/settings').send({
      ...getResponse.body.data,
      workspace_name: 'Creative Studio'
    });

    expect(putResponse.status).toBe(200);
    expect(putResponse.body.success).toBe(true);
  });

  test('GET /api/reports/summary devuelve resumen calculado', async () => {
    const response = await request(app).get('/api/reports/summary?period=all');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('total_tasks');
    expect(response.body.data).toHaveProperty('total_projects');
  });

  test('GET /api/notifications y PATCH read funcionan', async () => {
    const listResponse = await request(app).get('/api/notifications');

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.success).toBe(true);
    expect(Array.isArray(listResponse.body.data)).toBe(true);

    if (listResponse.body.data.length > 0) {
      const notification = listResponse.body.data[0];
      const readResponse = await request(app).patch(`/api/notifications/${notification.id}/read`);
      expect(readResponse.status).toBe(200);
      expect(readResponse.body.success).toBe(true);
    }
  });

  test('Subtareas: crear, listar, alternar y eliminar', async () => {
    const taskResponse = await request(app).post('/api/tasks').send({
      title: `Tarea con subtareas ${Date.now()}`,
      status: 'pendiente',
      priority: 'media'
    });

    const taskId = taskResponse.body.data.id;
    const createResponse = await request(app).post(`/api/tasks/${taskId}/subtasks`).send({
      title: 'Subtarea de evidencia'
    });

    expect(createResponse.status).toBe(201);

    const subtaskId = createResponse.body.data.id;
    const listResponse = await request(app).get(`/api/tasks/${taskId}/subtasks`);
    expect(listResponse.body.data.length).toBeGreaterThanOrEqual(1);

    const toggleResponse = await request(app).patch(`/api/subtasks/${subtaskId}/toggle`);
    expect(toggleResponse.status).toBe(200);

    const deleteResponse = await request(app).delete(`/api/subtasks/${subtaskId}`);
    expect(deleteResponse.status).toBe(200);
  });
});
