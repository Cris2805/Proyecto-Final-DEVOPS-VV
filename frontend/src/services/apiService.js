const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function apiRequest(path, options = {}) {
  try {
    const response = await fetch(`${API_URL}${path}`, {
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
      throw new Error('No se pudo conectar con el servidor');
    }
    throw error;
  }
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('taskflow_user') || 'null');
  } catch {
    return null;
  }
}
