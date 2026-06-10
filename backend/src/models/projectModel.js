import db, { databaseReady } from '../config/database.js';

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) reject(error);
      else resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) reject(error);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) reject(error);
      else resolve(rows);
    });
  });
}

function normalizeProject(project) {
  return {
    name: project.name?.trim(),
    description: project.description ?? null,
    status: project.status ?? 'en_progreso',
    priority: project.priority ?? 'media',
    progress: Math.min(100, Math.max(0, Number(project.progress ?? 0))),
    owner: project.owner ?? null,
    due_date: project.due_date ?? null,
    category: project.category ?? null
  };
}

export async function findAllProjects() {
  await databaseReady;
  return all('SELECT * FROM projects ORDER BY datetime(created_at) DESC, id DESC');
}

export async function findProjectById(id) {
  await databaseReady;
  return get('SELECT * FROM projects WHERE id = ?', [id]);
}

export async function createProject(project) {
  await databaseReady;
  const payload = normalizeProject(project);
  const result = await run(
    `INSERT INTO projects (name, description, status, priority, progress, owner, due_date, category)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [payload.name, payload.description, payload.status, payload.priority, payload.progress, payload.owner, payload.due_date, payload.category]
  );
  return findProjectById(result.lastID);
}

export async function updateProject(id, project) {
  await databaseReady;
  const payload = normalizeProject(project);
  const result = await run(
    `UPDATE projects
     SET name = ?, description = ?, status = ?, priority = ?, progress = ?, owner = ?,
         due_date = ?, category = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [payload.name, payload.description, payload.status, payload.priority, payload.progress, payload.owner, payload.due_date, payload.category, id]
  );
  if (result.changes === 0) return null;
  return findProjectById(id);
}

export async function deleteProject(id) {
  await databaseReady;
  const result = await run('DELETE FROM projects WHERE id = ?', [id]);
  return result.changes > 0;
}
