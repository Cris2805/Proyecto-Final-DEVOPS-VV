# Plan de Pruebas - TaskFlow

## 1. Objetivo del plan

Definir la estrategia de pruebas para verificar y validar el sistema TaskFlow, asegurando que sus funcionalidades principales operen correctamente y que el flujo DevOps permita ejecutar pruebas de forma repetible.

## 2. Alcance de pruebas

Incluye:

- API de salud `/api/health`;
- CRUD de tareas;
- validaciones de datos;
- conexion frontend-backend;
- pantalla Login;
- pantalla Tasks;
- Dashboard con datos reales;
- build del frontend;
- pipeline CI.

No incluye en esta etapa:

- autenticacion real;
- roles y permisos;
- pruebas de carga;
- despliegue real en produccion.

## 3. Tipos de pruebas

| Tipo | Herramienta | Objetivo |
|---|---|---|
| API / integracion | Jest + Supertest | Validar endpoints backend |
| E2E | Playwright | Validar flujos desde la interfaz |
| Build | Vite | Verificar compilacion frontend |
| Manual | Navegador | Revisar experiencia visual y usabilidad |

## 4. Criterios de entrada

- Dependencias instaladas con `npm install`.
- Backend disponible o ejecutable.
- Frontend compilable.
- Base SQLite creada o inicializable.
- Variables de entorno basicas disponibles.

## 5. Criterios de salida

- `npm test` ejecutado correctamente.
- `npm run build` ejecutado correctamente.
- Casos E2E definidos y listos para ejecucion.
- Resultados documentados.
- Errores criticos corregidos o registrados.

## 6. Criterios de aceptacion

El sistema se considera aceptable si:

- `/api/health` responde correctamente;
- el CRUD de tareas funciona;
- las validaciones rechazan datos invalidos;
- `/tasks` permite crear, editar, cambiar estado y eliminar;
- Dashboard refleja datos reales;
- el build no presenta errores;
- la documentacion permite reproducir pruebas.

## 7. Ambiente de pruebas

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Health: `http://localhost:3000/api/health`
- Base de datos: SQLite local
- Sistema operativo: entorno local o VM/Codespaces

## 8. Herramientas utilizadas

- Jest
- Supertest
- Playwright
- Vite
- GitHub Actions
- Scripts Bash

## 9. Riesgos

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| Backend apagado durante E2E | Fallo de pruebas de interfaz | Documentar ejecucion con `npm run dev` |
| Puerto ocupado | No inicia frontend/backend | Liberar procesos Node o cambiar instancia |
| Base SQLite con datos previos | Resultados variables | Crear datos de prueba controlados |
| Navegadores Playwright no instalados | No ejecuta E2E | Ejecutar instalacion de Playwright si aplica |
| Diferencias visuales por resolucion | Evidencias inconsistentes | Definir viewport o documentar resolucion |
