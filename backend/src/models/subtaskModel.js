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

export async function findSubtasksByTask(taskId) {
  await databaseReady;
  return all('SELECT * FROM subtasks WHERE task_id = ? ORDER BY id ASC', [taskId]);
}

export async function createSubtask(taskId, title) {
  await databaseReady;
  const result = await run('INSERT INTO subtasks (task_id, title) VALUES (?, ?)', [taskId, title.trim()]);
  return get('SELECT * FROM subtasks WHERE id = ?', [result.lastID]);
}

export async function toggleSubtask(id) {
  await databaseReady;
  const subtask = await get('SELECT * FROM subtasks WHERE id = ?', [id]);
  if (!subtask) return null;
  await run('UPDATE subtasks SET completed = ? WHERE id = ?', [subtask.completed ? 0 : 1, id]);
  return get('SELECT * FROM subtasks WHERE id = ?', [id]);
}

export async function deleteSubtask(id) {
  await databaseReady;
  const result = await run('DELETE FROM subtasks WHERE id = ?', [id]);
  return result.changes > 0;
}
