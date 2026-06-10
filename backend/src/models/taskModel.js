import db, { databaseReady } from '../config/database.js';

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

function normalizeTaskPayload(task) {
  return {
    title: task.title,
    description: task.description ?? null,
    status: task.status ?? 'pendiente',
    priority: task.priority ?? 'media',
    responsible: task.responsible ?? null,
    project: task.project ?? null,
    due_date: task.due_date ?? null,
    tags: Array.isArray(task.tags) ? task.tags.join(',') : task.tags ?? null
  };
}

export async function findAllTasks() {
  await databaseReady;
  return all('SELECT * FROM tasks ORDER BY datetime(created_at) DESC, id DESC');
}

export async function findTaskById(id) {
  await databaseReady;
  return get('SELECT * FROM tasks WHERE id = ?', [id]);
}

export async function createTask(task) {
  await databaseReady;
  const payload = normalizeTaskPayload(task);

  const result = await run(
    `INSERT INTO tasks (
      title, description, status, priority, responsible, project, due_date, tags
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.title,
      payload.description,
      payload.status,
      payload.priority,
      payload.responsible,
      payload.project,
      payload.due_date,
      payload.tags
    ]
  );

  return findTaskById(result.lastID);
}

export async function updateTask(id, task) {
  await databaseReady;
  const payload = normalizeTaskPayload(task);

  const result = await run(
    `UPDATE tasks
     SET title = ?,
         description = ?,
         status = ?,
         priority = ?,
         responsible = ?,
         project = ?,
         due_date = ?,
         tags = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      payload.title,
      payload.description,
      payload.status,
      payload.priority,
      payload.responsible,
      payload.project,
      payload.due_date,
      payload.tags,
      id
    ]
  );

  if (result.changes === 0) {
    return null;
  }

  return findTaskById(id);
}

export async function updateTaskStatus(id, status) {
  await databaseReady;
  const result = await run(
    `UPDATE tasks
     SET status = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [status, id]
  );

  if (result.changes === 0) {
    return null;
  }

  return findTaskById(id);
}

export async function deleteTask(id) {
  await databaseReady;
  const result = await run('DELETE FROM tasks WHERE id = ?', [id]);
  return result.changes > 0;
}
