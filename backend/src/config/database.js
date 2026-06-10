import path from 'node:path';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';

dotenv.config();

sqlite3.verbose();

const databasePath = process.env.DATABASE_PATH ?? './database/taskflow.db';
const resolvedPath = path.resolve(databasePath);

export const db = new sqlite3.Database(resolvedPath);

const seedTasks = [
  {
    title: 'Configurar pipeline CI',
    description: 'Preparar GitHub Actions para ejecutar pruebas y build.',
    status: 'completada',
    priority: 'alta',
    responsible: 'Carlos Mendoza',
    project: 'DevOps',
    due_date: '2026-06-12',
    tags: 'ci,devops'
  },
  {
    title: 'Diseñar tablero Kanban',
    description: 'Crear la base visual del tablero de tareas.',
    status: 'en_progreso',
    priority: 'media',
    responsible: 'Ana Lopez',
    project: 'Frontend',
    due_date: '2026-06-15',
    tags: 'ui,kanban'
  },
  {
    title: 'Documentar casos de prueba',
    description: 'Registrar casos funcionales y evidencias de validacion.',
    status: 'pendiente',
    priority: 'media',
    responsible: 'Maria Ruiz',
    project: 'V&V',
    due_date: '2026-06-20',
    tags: 'qa,documentacion'
  }
];

const seedUser = {
  name: 'Carlos Mendoza',
  email: 'carlos@taskflow.com',
  password: '123456',
  role: 'Administrador'
};

const seedProjects = [
  ['App movil', 'Experiencia movil para gestionar tareas y tableros desde cualquier lugar.', 'en_progreso', 'alta', 72, 'Ana Lopez', '2026-06-28', 'Producto'],
  ['Rediseno web', 'Actualizacion visual del portal principal con componentes premium.', 'en_progreso', 'media', 58, 'Ana Lopez', '2026-07-12', 'Frontend'],
  ['Integracion API', 'Conectar servicios internos con endpoints seguros y monitoreables.', 'en_progreso', 'alta', 64, 'Juan Perez', '2026-06-24', 'Backend'],
  ['Campana marketing', 'Lanzamiento multicanal para comunicar nuevas funcionalidades.', 'planificado', 'media', 35, 'Maria Ruiz', '2026-07-02', 'Marketing'],
  ['Sistema interno', 'Panel administrativo para operaciones, permisos y auditoria.', 'completado', 'baja', 92, 'Carlos Mendoza', '2026-06-18', 'Operaciones'],
  ['Automatizacion DevOps', 'Pipelines, scripts y controles para entrega continua del proyecto.', 'en_progreso', 'alta', 80, 'Carlos Mendoza', '2026-06-30', 'DevOps']
];

const seedNotifications = [
  ['Nueva tarea asignada', 'Tienes tareas pendientes por revisar.', 'info'],
  ['Vencimiento cercano', 'Hay tareas con fecha limite proxima.', 'warning'],
  ['Productividad actualizada', 'El resumen del equipo fue recalculado.', 'success']
];

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

export async function initializeDatabase() {
  await run('PRAGMA foreign_keys = ON');

  await run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'pendiente',
      priority TEXT NOT NULL DEFAULT 'media',
      responsible TEXT,
      project TEXT,
      due_date TEXT,
      tags TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const row = await get('SELECT COUNT(*) AS count FROM tasks');

  if (row.count === 0) {
    for (const task of seedTasks) {
      await run(
        `INSERT INTO tasks (
          title, description, status, priority, responsible, project, due_date, tags
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          task.title,
          task.description,
          task.status,
          task.priority,
          task.responsible,
          task.project,
          task.due_date,
          task.tags
        ]
      );
    }
  }

  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'Administrador',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const userColumns = await new Promise((resolve, reject) => {
    db.all('PRAGMA table_info(users)', [], (error, rows) => {
      if (error) reject(error);
      else resolve(rows.map((column) => column.name));
    });
  });

  const userColumnDefaults = {
    department: 'TEXT',
    avatar_initials: 'TEXT',
    status: "TEXT DEFAULT 'activo'",
    workload: 'INTEGER DEFAULT 0',
    productivity: 'INTEGER DEFAULT 0',
    assigned_tasks: 'INTEGER DEFAULT 0',
    updated_at: 'TEXT'
  };

  for (const [column, definition] of Object.entries(userColumnDefaults)) {
    if (!userColumns.includes(column)) {
      await run(`ALTER TABLE users ADD COLUMN ${column} ${definition}`);
    }
  }

  const user = await get('SELECT id FROM users WHERE email = ?', [seedUser.email]);

  if (!user) {
    // Proyecto academico: contrasena en texto plano para simplificar.
    // En produccion debe usarse bcrypt y politicas seguras de autenticacion.
    await run(
      `INSERT INTO users (name, email, password, role, department, avatar_initials, status, workload, productivity, assigned_tasks, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [seedUser.name, seedUser.email, seedUser.password, seedUser.role, 'Operaciones', 'CM', 'activo', 72, 88, 12]
    );
  }

  await run(`
    CREATE TABLE IF NOT EXISTS subtasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'en_progreso',
      priority TEXT DEFAULT 'media',
      progress INTEGER DEFAULT 0,
      owner TEXT,
      due_date TEXT,
      category TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const projectCount = await get('SELECT COUNT(*) AS count FROM projects');
  if (projectCount.count === 0) {
    for (const project of seedProjects) {
      await run(
        `INSERT INTO projects (name, description, status, priority, progress, owner, due_date, category)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        project
      );
    }
  }

  await run(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workspace_name TEXT DEFAULT 'Creative Studio',
      plan TEXT DEFAULT 'Premium',
      language TEXT DEFAULT 'Espanol',
      theme TEXT DEFAULT 'dark',
      primary_color TEXT DEFAULT 'blue-violet',
      email_notifications INTEGER DEFAULT 1,
      task_notifications INTEGER DEFAULT 1,
      deadline_notifications INTEGER DEFAULT 1,
      weekly_summary INTEGER DEFAULT 0,
      two_factor_enabled INTEGER DEFAULT 0,
      timezone TEXT DEFAULT 'America/Guayaquil',
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const settingsCount = await get('SELECT COUNT(*) AS count FROM settings');
  if (settingsCount.count === 0) {
    await run('INSERT INTO settings DEFAULT VALUES');
  }

  await run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      message TEXT,
      type TEXT DEFAULT 'info',
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  const notificationCount = await get('SELECT COUNT(*) AS count FROM notifications');
  if (notificationCount.count === 0) {
    const carlos = await get('SELECT id FROM users WHERE email = ?', [seedUser.email]);
    for (const notification of seedNotifications) {
      await run(
        `INSERT INTO notifications (user_id, title, message, type)
         VALUES (?, ?, ?, ?)`,
        [carlos?.id ?? null, ...notification]
      );
    }
  }
}

export const databaseReady = initializeDatabase();

export default db;
