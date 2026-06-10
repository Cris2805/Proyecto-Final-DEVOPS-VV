# Arquitectura - TaskFlow

## 1. Vision general

TaskFlow es una aplicacion fullstack separada en frontend, backend, base de datos, pruebas, documentacion y DevOps. La arquitectura permite que la interfaz web consuma una API REST y que los datos se persistan en SQLite.

## 2. Arquitectura frontend

El frontend esta construido con React, Vite y Tailwind CSS.

Responsabilidades principales:

- renderizar las pantallas del sistema;
- consumir endpoints del backend;
- mostrar datos reales en Dashboard y Tasks;
- mantener una experiencia visual moderna tipo SaaS;
- ejecutar build de produccion con Vite.

Carpetas principales:

- `frontend/src/pages`: pantallas del sistema.
- `frontend/src/components`: componentes reutilizables.
- `frontend/src/services`: comunicacion con API.
- `frontend/src/styles`: estilos globales.
- `frontend/src/routes`: definicion de rutas.

## 3. Arquitectura backend

El backend esta construido con Node.js y Express.

Responsabilidades principales:

- exponer API REST;
- validar datos de entrada;
- ejecutar operaciones CRUD;
- comunicarse con SQLite;
- responder en formato JSON.

Capas:

- `config/database.js`: conexion e inicializacion SQLite.
- `models/taskModel.js`: operaciones de datos.
- `controllers/taskController.js`: reglas de validacion y respuestas.
- `routes/taskRoutes.js`: definicion de endpoints.
- `app.js`: configuracion Express.
- `server.js`: arranque del servidor.

## 4. Base de datos SQLite

La base de datos usa SQLite local. La tabla principal es `tasks`.

Campos principales:

- `id`
- `title`
- `description`
- `status`
- `priority`
- `responsible`
- `project`
- `due_date`
- `tags`
- `created_at`
- `updated_at`

Estados permitidos:

- `pendiente`
- `en_progreso`
- `completada`

Prioridades permitidas:

- `alta`
- `media`
- `baja`

## 5. Comunicacion frontend-backend

El frontend consume el backend mediante `fetch` desde `frontend/src/services/taskService.js`.

URL base:

```text
http://localhost:3000/api
```

Ejemplo de flujo:

```text
Pantalla Tasks -> taskService.getTasks() -> GET /api/tasks -> SQLite
```

## 6. Endpoints principales

| Metodo | Endpoint | Descripcion |
|---|---|---|
| GET | `/api/health` | Verifica disponibilidad del backend |
| GET | `/api/tasks` | Lista tareas |
| GET | `/api/tasks/:id` | Obtiene una tarea |
| POST | `/api/tasks` | Crea una tarea |
| PUT | `/api/tasks/:id` | Actualiza una tarea |
| PATCH | `/api/tasks/:id/status` | Cambia estado |
| DELETE | `/api/tasks/:id` | Elimina una tarea |

## 7. Estructura del proyecto

```text
taskflow-devops-vv/
├── frontend/
├── backend/
├── devops/
├── tests/
├── docs/
├── .github/workflows/
├── README.md
└── package.json
```

## 8. Diagrama textual

```text
┌────────────────────┐
│ Usuario            │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Frontend React     │
│ Vite + Tailwind    │
└─────────┬──────────┘
          │ fetch HTTP
          ▼
┌────────────────────┐
│ Backend Express    │
│ API REST           │
└─────────┬──────────┘
          │ SQL
          ▼
┌────────────────────┐
│ SQLite             │
│ taskflow.db        │
└────────────────────┘

DevOps:
Scripts Bash + GitHub Actions + pruebas automatizadas
```
