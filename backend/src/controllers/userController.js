import { createUser, deleteUser, findAllUsers, findUserById, updateUser } from '../models/userModel.js';

function ok(res, code, message, data = null) {
  res.status(code).json({ success: true, message, data });
}

function fail(res, code, message) {
  res.status(code).json({ success: false, message });
}

function validate(body, editing = false) {
  if (!body.name?.trim()) return 'El nombre del usuario es obligatorio';
  if (!body.email?.trim()) return 'El correo del usuario es obligatorio';
  if (!editing && !body.password?.trim()) return 'La contrasena del usuario es obligatoria';
  return null;
}

export async function getUsers(req, res) {
  try {
    ok(res, 200, 'Usuarios obtenidos correctamente', await findAllUsers());
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al obtener usuarios');
  }
}

export async function getUser(req, res) {
  try {
    const user = await findUserById(req.params.id);
    if (!user) return fail(res, 404, 'El usuario no existe');
    ok(res, 200, 'Usuario obtenido correctamente', user);
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al obtener usuario');
  }
}

export async function postUser(req, res) {
  try {
    const error = validate(req.body);
    if (error) return fail(res, 400, error);
    ok(res, 201, 'Usuario creado correctamente', await createUser(req.body));
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al crear usuario');
  }
}

export async function putUser(req, res) {
  try {
    const error = validate(req.body, true);
    if (error) return fail(res, 400, error);
    const user = await updateUser(req.params.id, req.body);
    if (!user) return fail(res, 404, 'El usuario no existe');
    ok(res, 200, 'Usuario actualizado correctamente', user);
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al actualizar usuario');
  }
}

export async function removeUser(req, res) {
  try {
    const deleted = await deleteUser(req.params.id);
    if (!deleted) return fail(res, 404, 'El usuario no existe');
    ok(res, 200, 'Usuario eliminado correctamente');
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al eliminar usuario');
  }
}
