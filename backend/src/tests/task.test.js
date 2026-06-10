import request from 'supertest';
import app from '../app.js';

const validTask = {
  title: 'Tarea de prueba V&V',
  description: 'Creada desde pruebas automatizadas',
  status: 'pendiente',
  priority: 'alta',
  responsible: 'QA Team',
  project: 'TaskFlow',
  due_date: '2026-06-30',
  tags: 'test,vv'
};

async function createTestTask(overrides = {}) {
  const response = await request(app)
    .post('/api/tasks')
    .send({
      ...validTask,
      title: `${validTask.title} ${Date.now()}`,
      ...overrides
    });

  return response.body.data;
}

async function deleteIfExists(id) {
  if (id) {
    await request(app).delete(`/api/tasks/${id}`);
  }
}

describe('TaskFlow API - Verificacion y Validacion', () => {
  describe('Health check', () => {
    test('GET /api/health responde status 200 e indica que el backend funciona', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.service).toBe('taskflow-api');
    });
  });

  describe('Listado de tareas', () => {
    test('GET /api/tasks lista tareas con estructura JSON valida', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Tareas obtenidas correctamente');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Creacion de tareas', () => {
    let taskId;

    afterEach(async () => {
      await deleteIfExists(taskId);
      taskId = null;
    });

    test('POST /api/tasks crea una tarea con datos validos', async () => {
      const response = await request(app).post('/api/tasks').send(validTask);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Tarea creada correctamente');
      expect(response.body.data.title).toBe(validTask.title);
      expect(response.body.data.status).toBe('pendiente');
      expect(response.body.data.priority).toBe('alta');

      taskId = response.body.data.id;
    });

    test('POST /api/tasks rechaza tarea sin title', async () => {
      const { title, ...payload } = validTask;
      const response = await request(app).post('/api/tasks').send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('El titulo de la tarea es obligatorio');
    });

    test('POST /api/tasks rechaza title vacio', async () => {
      const response = await request(app).post('/api/tasks').send({ ...validTask, title: '   ' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('El titulo de la tarea es obligatorio');
    });

    test('POST /api/tasks rechaza title mayor a 120 caracteres', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ ...validTask, title: 'A'.repeat(121) });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('El titulo de la tarea debe tener maximo 120 caracteres');
    });

    test('POST /api/tasks rechaza status invalido', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ ...validTask, status: 'bloqueada' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('El estado de la tarea no es valido');
    });

    test('POST /api/tasks rechaza priority invalida', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ ...validTask, priority: 'urgente' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('La prioridad de la tarea no es valida');
    });
  });

  describe('Consulta y actualizacion de tareas', () => {
    let task;

    beforeEach(async () => {
      task = await createTestTask();
    });

    afterEach(async () => {
      await deleteIfExists(task?.id);
    });

    test('GET /api/tasks/:id obtiene una tarea existente', async () => {
      const response = await request(app).get(`/api/tasks/${task.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(task.id);
    });

    test('PUT /api/tasks/:id actualiza una tarea existente', async () => {
      const response = await request(app)
        .put(`/api/tasks/${task.id}`)
        .send({
          ...validTask,
          title: 'Tarea actualizada V&V',
          status: 'en_progreso',
          priority: 'media'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Tarea actualizada correctamente');
      expect(response.body.data.title).toBe('Tarea actualizada V&V');
      expect(response.body.data.status).toBe('en_progreso');
      expect(response.body.data.priority).toBe('media');
    });

    test('PUT /api/tasks/:id responde 404 si la tarea no existe', async () => {
      const response = await request(app).put('/api/tasks/99999999').send(validTask);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('La tarea no existe');
    });
  });

  describe('Cambio de estado de tareas', () => {
    let task;

    beforeEach(async () => {
      task = await createTestTask();
    });

    afterEach(async () => {
      await deleteIfExists(task?.id);
    });

    test('PATCH /api/tasks/:id/status cambia estado a en_progreso', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${task.id}/status`)
        .send({ status: 'en_progreso' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('en_progreso');
    });

    test('PATCH /api/tasks/:id/status cambia estado a completada', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${task.id}/status`)
        .send({ status: 'completada' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('completada');
    });

    test('PATCH /api/tasks/:id/status rechaza estado invalido', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${task.id}/status`)
        .send({ status: 'cancelada' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('El estado de la tarea no es valido');
    });
  });

  describe('Eliminacion de tareas', () => {
    test('DELETE /api/tasks/:id elimina una tarea existente', async () => {
      const task = await createTestTask();
      const response = await request(app).delete(`/api/tasks/${task.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Tarea eliminada correctamente');
    });

    test('DELETE /api/tasks/:id responde 404 si la tarea no existe', async () => {
      const response = await request(app).delete('/api/tasks/99999999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('La tarea no existe');
    });
  });
});
