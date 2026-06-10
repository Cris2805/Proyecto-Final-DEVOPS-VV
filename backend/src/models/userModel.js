import db, { databaseReady } from '../config/database.js';

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

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) reject(error);
      else resolve(this);
    });
  });
}

const publicUserFields = `
  id, name, email, role, department, avatar_initials, status,
  workload, productivity, assigned_tasks, created_at, updated_at
`;

export async function findUserByCredentials(email, password) {
  await databaseReady;

  // Proyecto academico: comparacion directa por texto plano.
  // En produccion debe usarse bcrypt.compare() con passwords hasheados.
  return get(
    `SELECT id, name, email, role, department, avatar_initials, status, workload, productivity, assigned_tasks
     FROM users
     WHERE email = ? AND password = ?`,
    [email, password]
  );
}

export async function findAllUsers() {
  await databaseReady;

  return all(
    `SELECT ${publicUserFields}
     FROM users
     ORDER BY id ASC`
  );
}

export async function findUserById(id) {
  await databaseReady;
  return get(`SELECT ${publicUserFields} FROM users WHERE id = ?`, [id]);
}

function initials(name = '') {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function normalizeUser(user) {
  return {
    name: user.name?.trim(),
    email: user.email?.trim(),
    password: user.password,
    role: user.role?.trim() || 'Miembro',
    department: user.department?.trim() || null,
    avatar_initials: user.avatar_initials?.trim() || initials(user.name),
    status: user.status || 'activo',
    workload: Number(user.workload ?? 0),
    productivity: Number(user.productivity ?? 0),
    assigned_tasks: Number(user.assigned_tasks ?? 0)
  };
}

export async function createUser(user) {
  await databaseReady;
  const payload = normalizeUser(user);
  const result = await run(
    `INSERT INTO users (
      name, email, password, role, department, avatar_initials, status,
      workload, productivity, assigned_tasks, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [
      payload.name,
      payload.email,
      payload.password,
      payload.role,
      payload.department,
      payload.avatar_initials,
      payload.status,
      payload.workload,
      payload.productivity,
      payload.assigned_tasks
    ]
  );
  return findUserById(result.lastID);
}

export async function updateUser(id, user) {
  await databaseReady;
  const current = await get('SELECT * FROM users WHERE id = ?', [id]);
  if (!current) return null;
  const payload = normalizeUser({ ...current, ...user, password: user.password || current.password });
  const result = await run(
    `UPDATE users
     SET name = ?, email = ?, password = ?, role = ?, department = ?, avatar_initials = ?,
         status = ?, workload = ?, productivity = ?, assigned_tasks = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      payload.name,
      payload.email,
      payload.password,
      payload.role,
      payload.department,
      payload.avatar_initials,
      payload.status,
      payload.workload,
      payload.productivity,
      payload.assigned_tasks,
      id
    ]
  );
  if (result.changes === 0) return null;
  return findUserById(id);
}

export async function deleteUser(id) {
  await databaseReady;
  const result = await run('DELETE FROM users WHERE id = ?', [id]);
  return result.changes > 0;
}
