import db, { databaseReady } from '../config/database.js';

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) reject(error);
      else resolve(rows);
    });
  });
}

function one(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) reject(error);
      else resolve(row);
    });
  });
}

function whereByPeriod(period) {
  if (period === 'today') return "date(created_at) = date('now', 'localtime')";
  if (period === 'this_week') return "date(created_at) >= date('now', '-6 days', 'localtime')";
  if (period === 'this_month') return "strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now', 'localtime')";
  return '1 = 1';
}

export async function getReportSummary(req, res) {
  try {
    await databaseReady;
    const period = req.query.period ?? 'this_week';
    const taskWhere = whereByPeriod(period);
    const [taskTotals, projectTotals, userTotals, statusRows, priorityRows, workloadRows, upcomingTasks, upcomingProjects] = await Promise.all([
      one(`SELECT
          COUNT(*) AS total_tasks,
          SUM(status = 'completada') AS completed_tasks,
          SUM(status = 'pendiente') AS pending_tasks,
          SUM(status = 'en_progreso') AS in_progress_tasks
        FROM tasks WHERE ${taskWhere}`),
      one(`SELECT
          COUNT(*) AS total_projects,
          SUM(status = 'en_progreso') AS active_projects,
          SUM(status = 'completado') AS completed_projects
        FROM projects`),
      one('SELECT COUNT(*) AS total_users, AVG(productivity) AS productivity_average FROM users'),
      all(`SELECT status, COUNT(*) AS count FROM tasks WHERE ${taskWhere} GROUP BY status`),
      all(`SELECT priority, COUNT(*) AS count FROM tasks WHERE ${taskWhere} GROUP BY priority`),
      all('SELECT name, role, workload, productivity, assigned_tasks FROM users ORDER BY workload DESC'),
      all("SELECT title, due_date, 'task' AS type FROM tasks WHERE due_date IS NOT NULL ORDER BY date(due_date) ASC LIMIT 5"),
      all("SELECT name AS title, due_date, 'project' AS type FROM projects WHERE due_date IS NOT NULL ORDER BY date(due_date) ASC LIMIT 5")
    ]);

    const total = taskTotals.total_tasks ?? 0;
    const completed = taskTotals.completed_tasks ?? 0;
    res.json({
      success: true,
      message: 'Resumen obtenido correctamente',
      data: {
        total_tasks: total,
        completed_tasks: completed,
        pending_tasks: taskTotals.pending_tasks ?? 0,
        in_progress_tasks: taskTotals.in_progress_tasks ?? 0,
        total_projects: projectTotals.total_projects ?? 0,
        active_projects: projectTotals.active_projects ?? 0,
        completed_projects: projectTotals.completed_projects ?? 0,
        total_users: userTotals.total_users ?? 0,
        completion_rate: total === 0 ? 0 : Math.round((completed / total) * 100),
        productivity_average: Math.round(userTotals.productivity_average ?? 0),
        tasks_by_status: statusRows,
        tasks_by_priority: priorityRows,
        workload_by_user: workloadRows,
        upcoming_deadlines: [...upcomingTasks, ...upcomingProjects]
          .filter((item) => item.due_date)
          .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
          .slice(0, 5)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error interno al obtener reportes' });
  }
}
