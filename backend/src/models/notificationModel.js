import db, { databaseReady } from '../config/database.js';

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) reject(error);
      else resolve(this);
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

export async function findAllNotifications() {
  await databaseReady;
  return all('SELECT * FROM notifications ORDER BY datetime(created_at) DESC, id DESC');
}

export async function markNotificationRead(id) {
  await databaseReady;
  const result = await run('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
  return result.changes > 0;
}

export async function markAllNotificationsRead() {
  await databaseReady;
  await run('UPDATE notifications SET is_read = 1');
  return findAllNotifications();
}
