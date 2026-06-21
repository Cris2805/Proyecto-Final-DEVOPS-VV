const API_URL = import.meta.env.VITE_API_URL || '/api';
const TASKS_URL = `${API_URL}/tasks`;

async function requestJson(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    const payload = await response.json();

    if (!response.ok || payload.success === false) {
      throw new Error(payload.message ?? 'Ocurrio un error al procesar la solicitud');
    }

    return payload.data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('No se pudo conectar con el servidor de tareas.');
    }

    throw error;
  }
}

// Servicio base para conectar el frontend con la API de tareas.
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      return {
        connected: false,
        message: 'No se pudo conectar con el backend',
        error: `Respuesta HTTP ${response.status}`
      };
    }

    const data = await response.json();

    return {
      connected: true,
      message: 'Backend conectado correctamente',
      data
    };
  } catch (error) {
    return {
      connected: false,
      message: 'No se pudo conectar con el backend',
      error: error.message
    };
  }
}

export function getTasks() {
  return requestJson(TASKS_URL);
}

export function getTaskById(id) {
  return requestJson(`${TASKS_URL}/${id}`);
}

export function createTask(taskData) {
  return requestJson(TASKS_URL, {
    method: 'POST',
    body: JSON.stringify(taskData)
  });
}

export function updateTask(id, taskData) {
  return requestJson(`${TASKS_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData)
  });
}

export function updateTaskStatus(id, status) {
  return requestJson(`${TASKS_URL}/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

export function deleteTask(id) {
  return requestJson(`${TASKS_URL}/${id}`, {
    method: 'DELETE'
  });
}

export function getSubtasks(taskId) {
  return requestJson(`${TASKS_URL}/${taskId}/subtasks`);
}

export function createSubtask(taskId, title) {
  return requestJson(`${TASKS_URL}/${taskId}/subtasks`, {
    method: 'POST',
    body: JSON.stringify({ title })
  });
}

export function toggleSubtask(id) {
  return requestJson(`${API_URL}/subtasks/${id}/toggle`, {
    method: 'PATCH'
  });
}

export function deleteSubtask(id) {
  return requestJson(`${API_URL}/subtasks/${id}`, {
    method: 'DELETE'
  });
}

export default {
  checkBackendHealth,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getSubtasks,
  createSubtask,
  toggleSubtask,
  deleteSubtask
};
