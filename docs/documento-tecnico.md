# Documento Tecnico - TaskFlow

## 1. Descripcion del sistema

TaskFlow es un sistema web fullstack para la gestion de tareas, proyectos y productividad de equipos. El sistema permite visualizar tareas, crear registros, editar informacion, cambiar estados, eliminar tareas y consultar resumenes desde un dashboard conectado a datos reales.

El proyecto fue desarrollado como actividad integradora de DevOps y Verificacion y Validacion de Software, por lo que combina desarrollo funcional, automatizacion, pruebas, documentacion y pipeline de integracion continua.

## 2. Objetivo del sistema

El objetivo de TaskFlow es proporcionar una aplicacion web organizada y visualmente moderna para gestionar tareas de un equipo, permitiendo controlar estados, prioridades, responsables, proyectos y fechas limite.

Desde el enfoque academico, el objetivo tambien es evidenciar buenas practicas de:

- separacion frontend/backend;
- API REST;
- persistencia en base de datos;
- pruebas automatizadas;
- scripts DevOps;
- pipeline CI;
- documentacion tecnica y de pruebas.

## 3. Tecnologias utilizadas

| Area | Tecnologia |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Base de datos | SQLite |
| Pruebas backend | Jest, Supertest |
| Pruebas E2E | Playwright |
| DevOps | Bash scripts, GitHub Actions |
| Servidor web sugerido | Nginx |

URLs locales:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Health check: `http://localhost:3000/api/health`

## 4. Arquitectura general

TaskFlow utiliza una arquitectura fullstack separada:

- El frontend consume la API REST mediante `fetch`.
- El backend expone endpoints bajo `/api`.
- SQLite almacena las tareas localmente.
- Los scripts DevOps automatizan instalacion, ejecucion, pruebas y build.
- GitHub Actions ejecuta integracion continua.

Flujo general:

```text
Usuario -> Frontend React -> API Express -> SQLite
                         -> Pruebas/CI -> Evidencias
```

## 5. Gestion de ambientes

### Desarrollo

Ambiente local para programacion y pruebas rapidas.

- Frontend en `http://localhost:5173`
- Backend en `http://localhost:3000`
- Base SQLite local en `backend/database/taskflow.db`

### Pruebas

Ambiente orientado a validacion automatizada.

- Pruebas API con Jest/Supertest.
- Pruebas E2E con Playwright.
- Build del frontend para validar compilacion.

### Produccion

Ambiente propuesto para despliegue futuro.

- Frontend construido con `npm run build`.
- Backend ejecutado como servicio Node.js.
- Nginx como proxy o servidor de archivos estaticos.
- Variables de entorno protegidas.

## 6. Flujo DevOps

El flujo DevOps del proyecto incluye:

1. Instalacion de dependencias con `npm install` o `devops/scripts/install.sh`.
2. Ejecucion local con `npm run dev`.
3. Pruebas automatizadas con `npm test`.
4. Build de produccion con `npm run build`.
5. Pipeline CI con GitHub Actions.
6. Documentacion de ambientes y evidencias de pruebas.

## 7. Estrategia de Verificacion y Validacion

La verificacion se centra en comprobar que el sistema fue construido correctamente:

- endpoints REST disponibles;
- validaciones de entrada;
- persistencia en SQLite;
- build exitoso;
- estructura de proyecto organizada.

La validacion se centra en comprobar que el sistema satisface necesidades funcionales:

- crear tareas;
- listar tareas;
- editar tareas;
- cambiar estado;
- eliminar tareas;
- visualizar datos reales en Dashboard;
- navegar por pantallas principales.

## 8. Resultados obtenidos

Se obtuvo un sistema funcional con:

- frontend visual completo;
- backend Express conectado a SQLite;
- CRUD real de tareas;
- Dashboard conectado a datos reales;
- pruebas backend automatizadas;
- pruebas E2E definidas con Playwright;
- scripts DevOps funcionales;
- pipeline CI basico.

## 9. Problemas encontrados

Durante el desarrollo se identificaron problemas comunes:

- configuracion inicial incompleta de Tailwind/PostCSS;
- puertos ocupados por procesos Node previos;
- necesidad de separar rutas internas del Login;
- ajustes visuales por solapamiento en pantallas complejas;
- manejo de datos mock antes de conectar el CRUD real.

## 10. Mejoras propuestas

- Agregar autenticacion real.
- Implementar roles y permisos.
- Agregar paginacion real en backend.
- Agregar migraciones formales para SQLite.
- Guardar evidencias automaticas de Playwright.
- Ejecutar E2E en CI con servicios levantados.
- Agregar cobertura de pruebas frontend.

## 11. Conclusiones

TaskFlow demuestra la integracion de desarrollo fullstack, DevOps y Verificacion y Validacion. El sistema no solo presenta una interfaz moderna, sino que tambien cuenta con backend funcional, persistencia, pruebas automatizadas y pipeline CI. Esto permite evidenciar un ciclo de desarrollo mas cercano a un entorno profesional.
