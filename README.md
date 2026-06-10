# TaskFlow DevOps + V&V

TaskFlow es un sistema web de gestion de tareas desarrollado para una actividad integradora de DevOps y Verificacion y Validacion de Software.

## Estructura

- `frontend/`: aplicacion React + Vite + Tailwind CSS.
- `backend/`: API REST con Node.js, Express y SQLite.
- `devops/`: scripts Bash, configuracion Nginx y documentacion de ambientes.
- `tests/e2e/`: pruebas E2E con Playwright.
- `docs/`: documentacion tecnica y evidencias de pruebas.
- `.github/workflows/`: pipeline de integracion continua.

## Instalacion

Desde la raiz del proyecto:

```bash
npm install
```

Tambien puedes usar el script DevOps:

```bash
bash devops/scripts/install.sh
```

## Ejecucion en desarrollo

```bash
npm run dev
```

O con el script DevOps:

```bash
bash devops/scripts/run.sh
```

URLs principales:

- Frontend: `http://localhost:5173`
- Login: `http://localhost:5173/login`
- Backend: `http://localhost:3000`
- Health check: `http://localhost:3000/api/health`

## Pruebas

Pruebas backend/frontend:

```bash
npm test
```

O con el script DevOps:

```bash
bash devops/scripts/test.sh
```

Pruebas E2E con Playwright:

```bash
npm run dev
```

En otra terminal:

```bash
npm run test:e2e
```

Las pruebas E2E requieren que frontend y backend esten activos.

## Build

```bash
npm run build
```

O con el script DevOps:

```bash
bash devops/scripts/build.sh
```

## Endpoints principales

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/auth/users`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `PATCH /api/tasks/:id/status`
- `DELETE /api/tasks/:id`
- `GET /api/tasks/:id/subtasks`
- `POST /api/tasks/:id/subtasks`
- `PATCH /api/subtasks/:id/toggle`
- `DELETE /api/subtasks/:id`
- `GET /api/projects`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `GET /api/settings`
- `PUT /api/settings`
- `GET /api/reports/summary?period=this_week`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `PATCH /api/notifications/read-all`

## Base de datos y usuario inicial

TaskFlow usa SQLite como base de datos local.

- Archivo: `backend/database/taskflow.db`
- Tabla de tareas: `tasks`
- Tabla de usuarios: `users`
- Tabla de subtareas: `subtasks`
- Tabla de proyectos: `projects`
- Tabla de ajustes: `settings`
- Tabla de notificaciones: `notifications`

Usuario inicial para acceder al sistema:

- Correo: `carlos@taskflow.com`
- Contrasena: `123456`

El login se valida contra `POST http://localhost:3000/api/auth/login`. Para evidencia academica, los usuarios pueden consultarse sin exponer contrasenas en `GET http://localhost:3000/api/auth/users`.

## Modulos conectados a SQLite

- Login: valida cualquier usuario creado en la tabla `users`.
- Dashboard: muestra tareas reales, productividad real y navega hacia `/tasks`.
- Tasks: CRUD real, filtros, ordenamiento, paginacion y subtareas.
- Projects: lista, crea, edita y elimina proyectos reales.
- Team: lista, crea, edita y elimina usuarios reales.
- Reports: calcula resumen desde tareas, proyectos y usuarios; permite exportar CSV.
- Settings: carga y guarda configuracion real del workspace.
- Header: muestra notificaciones reales y permite cerrar sesion.

## Scripts raiz

- `npm run dev`: ejecuta frontend y backend en modo desarrollo.
- `npm test`: ejecuta pruebas backend y frontend.
- `npm run build`: genera build de produccion del frontend.
- `npm run test:e2e`: ejecuta pruebas E2E con Playwright.

## DevOps + V&V

El proyecto incluye scripts Bash para instalacion, ejecucion, pruebas y build. Tambien incluye un pipeline de GitHub Actions que instala dependencias, ejecuta pruebas y genera el build del frontend.

La parte de Verificacion y Validacion cubre:

- pruebas de API para `/api/health`;
- pruebas CRUD de tareas;
- validaciones de datos;
- pruebas E2E para login y gestion de tareas;
- evidencias documentables en `tests/evidence/`.
