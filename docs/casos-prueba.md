# Casos de Prueba - TaskFlow

| ID | Tipo | Modulo | Descripcion | Datos de entrada | Resultado esperado | Prioridad |
|---|---|---|---|---|---|---|
| CP-001 | Backend | Health | Verificar disponibilidad del backend | GET `/api/health` | Responde 200 y `status: ok` | Alta |
| CP-002 | Backend | Tareas | Consultar tareas | GET `/api/tasks` | Responde JSON con `success: true` y arreglo de tareas | Alta |
| CP-003 | Backend | Tareas | Crear tarea valida | title, status, priority, responsible, project | Responde 201 y retorna tarea creada | Alta |
| CP-004 | Backend | Tareas | Crear tarea sin titulo | body sin `title` | Responde 400 con mensaje de titulo obligatorio | Alta |
| CP-005 | Backend | Tareas | Crear tarea con titulo vacio | `title: "   "` | Responde 400 con mensaje de titulo obligatorio | Alta |
| CP-006 | Backend | Tareas | Crear tarea con titulo mayor a 120 caracteres | `title` con 121 caracteres | Responde 400 con mensaje de longitud maxima | Media |
| CP-007 | Backend | Tareas | Crear tarea con status invalido | `status: "bloqueada"` | Responde 400 con mensaje de estado invalido | Alta |
| CP-008 | Backend | Tareas | Crear tarea con priority invalida | `priority: "urgente"` | Responde 400 con mensaje de prioridad invalida | Alta |
| CP-009 | Backend | Tareas | Editar tarea existente | PUT `/api/tasks/:id` con datos validos | Responde 200 y actualiza datos | Alta |
| CP-010 | Backend | Tareas | Editar tarea inexistente | PUT `/api/tasks/99999999` | Responde 404 | Media |
| CP-011 | Backend | Tareas | Cambiar estado a en progreso | PATCH status `en_progreso` | Responde 200 y actualiza estado | Alta |
| CP-012 | Backend | Tareas | Cambiar estado a completada | PATCH status `completada` | Responde 200 y actualiza estado | Alta |
| CP-013 | Backend | Tareas | Rechazar estado invalido en PATCH | PATCH status `cancelada` | Responde 400 | Alta |
| CP-014 | Backend | Tareas | Eliminar tarea existente | DELETE `/api/tasks/:id` | Responde 200 y elimina tarea | Alta |
| CP-015 | Backend | Tareas | Eliminar tarea inexistente | DELETE `/api/tasks/99999999` | Responde 404 | Media |
| CP-016 | E2E | Login | Verificar carga de Login | Abrir `/login` | Se muestra formulario de inicio de sesion | Alta |
| CP-017 | E2E | Tareas | Crear tarea desde interfaz | Formulario `/tasks` | La tarea aparece en tabla | Alta |
| CP-018 | E2E | Tareas | Editar tarea desde interfaz | Seleccionar fila y actualizar titulo | La tabla muestra titulo actualizado | Alta |
| CP-019 | E2E | Tareas | Cambiar estado desde interfaz | Select de estado | El estado cambia a completada | Alta |
| CP-020 | E2E | Tareas | Eliminar tarea desde interfaz | Boton eliminar + confirmacion | La tarea desaparece de tabla | Alta |
| CP-021 | Frontend | Dashboard | Dashboard con datos reales | Abrir `/` con backend activo | KPIs y Kanban reflejan tareas reales | Alta |
| CP-022 | Frontend | Tareas | Backend apagado | Abrir `/tasks` sin backend | Muestra mensaje de error controlado | Media |

## Observaciones

Los casos backend se ejecutan con `npm test`. Los casos E2E se ejecutan con `npm run test:e2e` con frontend y backend activos.
