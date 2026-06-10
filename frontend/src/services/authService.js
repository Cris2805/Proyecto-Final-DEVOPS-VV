const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const payload = await response.json();

    if (!response.ok || payload.success === false) {
      throw new Error(payload.message ?? 'Credenciales incorrectas');
    }

    return payload.data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('No se pudo conectar con el servidor');
    }

    throw error;
  }
}

export default {
  loginUser
};
