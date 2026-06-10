import {
  createTask,
  deleteTask,
  findAllTasks,
  findTaskById,
  updateTask,
  updateTaskStatus
} from '../models/taskModel.js';

const allowedStatuses = ['pendiente', 'en_progreso', 'completada'];
const allowedPriorities = ['alta', 'media', 'baja'];

function success(res, statusCode, message, data = null) {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

function fail(res, statusCode, message) {
  res.status(statusCode).json({
    success: false,
    message
  });
}

function validateTaskPayload(body) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const status = body.status ?? 'pendiente';
  const priority = body.priority ?? 'media';

  if (!title) {
    return 'El titulo de la tarea es obligatorio';
  }

  if (title.length > 120) {
    return 'El titulo de la tarea debe tener maximo 120 caracteres';
  }

  if (!allowedStatuses.includes(status)) {
    return 'El estado de la tarea no es valido';
  }

  if (!allowedPriorities.includes(priority)) {
    return 'La prioridad de la tarea no es valida';
  }

  return null;
}

function buildTaskPayload(body) {
  return {
    title: body.title.trim(),
    description: body.description ?? null,
    status: body.status ?? 'pendiente',
    priority: body.priority ?? 'media',
    responsible: body.responsible ?? null,
    project: body.project ?? null,
    due_date: body.due_date ?? null,
    tags: body.tags ?? null
  };
}

export async function getTasks(req, res) {
  try {
    const tasks = await findAllTasks();
    success(res, 200, 'Tareas obtenidas correctamente', tasks);
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al obtener las tareas');
  }
}

export async function getTask(req, res) {
  try {
    const task = await findTaskById(req.params.id);

    if (!task) {
      fail(res, 404, 'La tarea no existe');
      return;
    }

    success(res, 200, 'Tarea obtenida correctamente', task);
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al obtener la tarea');
  }
}

export async function postTask(req, res) {
  try {
    const validationError = validateTaskPayload(req.body);

    if (validationError) {
      fail(res, 400, validationError);
      return;
    }

    const task = await createTask(buildTaskPayload(req.body));
    success(res, 201, 'Tarea creada correctamente', task);
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al crear la tarea');
  }
}

export async function putTask(req, res) {
  try {
    const validationError = validateTaskPayload(req.body);

    if (validationError) {
      fail(res, 400, validationError);
      return;
    }

    const task = await updateTask(req.params.id, buildTaskPayload(req.body));

    if (!task) {
      fail(res, 404, 'La tarea no existe');
      return;
    }

    success(res, 200, 'Tarea actualizada correctamente', task);
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al actualizar la tarea');
  }
}

export async function patchTaskStatus(req, res) {
  try {
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      fail(res, 400, 'El estado de la tarea no es valido');
      return;
    }

    const task = await updateTaskStatus(req.params.id, status);

    if (!task) {
      fail(res, 404, 'La tarea no existe');
      return;
    }

    success(res, 200, 'Estado de la tarea actualizado correctamente', task);
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al actualizar el estado de la tarea');
  }
}

export async function removeTask(req, res) {
  try {
    const deleted = await deleteTask(req.params.id);

    if (!deleted) {
      fail(res, 404, 'La tarea no existe');
      return;
    }

    success(res, 200, 'Tarea eliminada correctamente');
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al eliminar la tarea');
  }
}
