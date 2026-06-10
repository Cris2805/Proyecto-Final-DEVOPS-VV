import { createSubtask, deleteSubtask, findSubtasksByTask, toggleSubtask } from '../models/subtaskModel.js';

function ok(res, code, message, data = null) {
  res.status(code).json({ success: true, message, data });
}

function fail(res, code, message) {
  res.status(code).json({ success: false, message });
}

export async function getSubtasks(req, res) {
  try {
    ok(res, 200, 'Subtareas obtenidas correctamente', await findSubtasksByTask(req.params.id));
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al obtener subtareas');
  }
}

export async function postSubtask(req, res) {
  try {
    if (!req.body.title?.trim()) return fail(res, 400, 'El titulo de la subtarea es obligatorio');
    ok(res, 201, 'Subtarea creada correctamente', await createSubtask(req.params.id, req.body.title));
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al crear subtarea');
  }
}

export async function patchSubtaskToggle(req, res) {
  try {
    const subtask = await toggleSubtask(req.params.id);
    if (!subtask) return fail(res, 404, 'La subtarea no existe');
    ok(res, 200, 'Subtarea actualizada correctamente', subtask);
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al actualizar subtarea');
  }
}

export async function removeSubtask(req, res) {
  try {
    const deleted = await deleteSubtask(req.params.id);
    if (!deleted) return fail(res, 404, 'La subtarea no existe');
    ok(res, 200, 'Subtarea eliminada correctamente');
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al eliminar subtarea');
  }
}
