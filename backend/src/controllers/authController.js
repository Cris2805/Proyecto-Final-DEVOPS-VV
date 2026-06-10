import { findAllUsers, findUserByCredentials } from '../models/userModel.js';

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

export async function login(req, res) {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    const user = await findUserByCredentials(email, password);

    if (!user) {
      fail(res, 401, 'Credenciales incorrectas');
      return;
    }

    success(res, 200, 'Inicio de sesión correcto', user);
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al iniciar sesión');
  }
}

export async function listUsers(req, res) {
  try {
    const users = await findAllUsers();
    success(res, 200, 'Usuarios obtenidos correctamente', users);
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al obtener usuarios');
  }
}
