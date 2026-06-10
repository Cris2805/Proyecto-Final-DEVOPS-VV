import db, { databaseReady } from '../config/database.js';

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) reject(error);
      else resolve(row);
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

export async function getSettings() {
  await databaseReady;
  return get('SELECT * FROM settings ORDER BY id ASC LIMIT 1');
}

export async function updateSettings(settings) {
  await databaseReady;
  const current = await getSettings();
  const payload = { ...current, ...settings };
  await run(
    `UPDATE settings
     SET workspace_name = ?, plan = ?, language = ?, theme = ?, primary_color = ?,
         email_notifications = ?, task_notifications = ?, deadline_notifications = ?,
         weekly_summary = ?, two_factor_enabled = ?, timezone = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      payload.workspace_name,
      payload.plan,
      payload.language,
      payload.theme,
      payload.primary_color,
      Number(payload.email_notifications ? 1 : 0),
      Number(payload.task_notifications ? 1 : 0),
      Number(payload.deadline_notifications ? 1 : 0),
      Number(payload.weekly_summary ? 1 : 0),
      Number(payload.two_factor_enabled ? 1 : 0),
      payload.timezone,
      current.id
    ]
  );
  return getSettings();
}
