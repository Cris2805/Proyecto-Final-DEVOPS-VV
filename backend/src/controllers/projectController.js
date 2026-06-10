import {
  createProject,
  deleteProject,
  findAllProjects,
  findProjectById,
  updateProject
} from '../models/projectModel.js';

const statuses = ['planificado', 'en_progreso', 'completado', 'pausado'];
const priorities = ['alta', 'media', 'baja'];

function ok(res, code, message, data = null) {
  res.status(code).json({ success: true, message, data });
}

function fail(res, code, message) {
  res.status(code).json({ success: false, message });
}

function validate(body) {
  if (!body.name?.trim()) return 'El nombre del proyecto es obligatorio';
  if (!statuses.includes(body.status ?? 'en_progreso')) return 'El estado del proyecto no es valido';
  if (!priorities.includes(body.priority ?? 'media')) return 'La prioridad del proyecto no es valida';
  const progress = Number(body.progress ?? 0);
  if (Number.isNaN(progress) || progress < 0 || progress > 100) return 'El progreso debe estar entre 0 y 100';
  return null;
}

export async function getProjects(req, res) {
  try {
    ok(res, 200, 'Proyectos obtenidos correctamente', await findAllProjects());
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al obtener proyectos');
  }
}

export async function getProject(req, res) {
  try {
    const project = await findProjectById(req.params.id);
    if (!project) return fail(res, 404, 'El proyecto no existe');
    ok(res, 200, 'Proyecto obtenido correctamente', project);
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al obtener proyecto');
  }
}

export async function postProject(req, res) {
  try {
    const error = validate(req.body);
    if (error) return fail(res, 400, error);
    ok(res, 201, 'Proyecto creado correctamente', await createProject(req.body));
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al crear proyecto');
  }
}

export async function putProject(req, res) {
  try {
    const error = validate(req.body);
    if (error) return fail(res, 400, error);
    const project = await updateProject(req.params.id, req.body);
    if (!project) return fail(res, 404, 'El proyecto no existe');
    ok(res, 200, 'Proyecto actualizado correctamente', project);
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al actualizar proyecto');
  }
}

export async function removeProject(req, res) {
  try {
    const deleted = await deleteProject(req.params.id);
    if (!deleted) return fail(res, 404, 'El proyecto no existe');
    ok(res, 200, 'Proyecto eliminado correctamente');
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al eliminar proyecto');
  }
}
