# Resultados de Pruebas - TaskFlow

## 1. Resumen de ejecucion

Se ejecutaron pruebas automatizadas para verificar la API backend, validar reglas de negocio del CRUD de tareas y comprobar que el frontend compila correctamente.

Comandos verificados:

```bash
npm test
npm run build
```

Resultado general:

- Pruebas backend: exitosas.
- Pruebas frontend: exitosas, sin archivos de prueba unitarios frontend definidos todavia.
- Build frontend: exitoso.
- Pruebas E2E: definidas con Playwright y listas para ejecucion local con servidores activos.

## 2. Resultados backend

La suite backend cubre:

- Health check.
- Listado de tareas.
- Creacion valida.
- Validaciones de titulo.
- Validaciones de status.
- Validaciones de priority.
- Actualizacion de tarea.
- Cambio de estado.
- Eliminacion.
- Respuestas 404.

Resultado registrado:

| Area | Resultado |
|---|---|
| `/api/health` | Correcto |
| `GET /api/tasks` | Correcto |
| `POST /api/tasks` | Correcto |
| Validaciones | Correctas |
| `PUT /api/tasks/:id` | Correcto |
| `PATCH /api/tasks/:id/status` | Correcto |
| `DELETE /api/tasks/:id` | Correcto |

## 3. Resultados E2E

Se definieron pruebas Playwright para:

- cargar Login;
- abrir gestion de tareas;
- crear tarea desde interfaz;
- editar tarea;
- cambiar estado;
- eliminar tarea.

Para ejecutar:

```bash
npm run dev
npm run test:e2e
```

Estas pruebas requieren frontend y backend activos.

## 4. Resultados de build

El build del frontend con Vite se ejecuta mediante:

```bash
npm run build
```

Resultado esperado:

- generacion de carpeta `frontend/dist`;
- compilacion sin errores;
- assets optimizados para produccion.

## 5. Pruebas manuales recomendadas

| ID | Prueba manual | Resultado esperado |
|---|---|---|
| PM-001 | Abrir `/login` | Login visual carga correctamente |
| PM-002 | Abrir `/tasks` con backend activo | Se listan tareas reales |
| PM-003 | Crear tarea sin titulo | Se muestra mensaje de validacion |
| PM-004 | Crear tarea completa | La tarea aparece en tabla |
| PM-005 | Cambiar estado | Dashboard actualiza conteos |
| PM-006 | Eliminar tarea | La tarea desaparece |
| PM-007 | Apagar backend y abrir `/tasks` | Mensaje de error controlado |
| PM-008 | Abrir `/reports`, `/projects`, `/team`, `/settings` | Pantallas cargan sin errores |

## 6. Tabla de errores detectados

| Error | Estado | Solucion aplicada |
|---|---|---|
| Tailwind no aplicaba estilos | Corregido | Se agrego configuracion PostCSS |
| Puertos ocupados por procesos Node | Corregido | Se liberaron procesos y se documento uso de Ctrl+C |
| Login con elementos solapados | Corregido | Se ajusto distribucion visual |
| Pantallas secundarias vacias | Corregido | Se completaron Projects, Team y Settings |
| Dashboard con datos mock | Corregido | Se conecto a tareas reales |

## 7. Mejoras propuestas

- Agregar reporte HTML de Playwright a evidencias.
- Agregar pruebas unitarias frontend.
- Ejecutar E2E dentro del pipeline CI.
- Agregar cobertura de codigo.
- Agregar pruebas de accesibilidad.
- Documentar capturas reales de cada ejecucion.
