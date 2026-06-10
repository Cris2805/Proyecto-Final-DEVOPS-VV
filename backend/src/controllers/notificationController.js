import {
  findAllNotifications,
  markAllNotificationsRead,
  markNotificationRead
} from '../models/notificationModel.js';

function ok(res, code, message, data = null) {
  res.status(code).json({ success: true, message, data });
}

function fail(res, code, message) {
  res.status(code).json({ success: false, message });
}

export async function getNotifications(req, res) {
  try {
    ok(res, 200, 'Notificaciones obtenidas correctamente', await findAllNotifications());
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al obtener notificaciones');
  }
}

export async function patchNotificationRead(req, res) {
  try {
    const updated = await markNotificationRead(req.params.id);
    if (!updated) return fail(res, 404, 'La notificacion no existe');
    ok(res, 200, 'Notificacion marcada como leida');
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al actualizar notificacion');
  }
}

export async function patchAllNotificationsRead(req, res) {
  try {
    ok(res, 200, 'Notificaciones marcadas como leidas', await markAllNotificationsRead());
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al actualizar notificaciones');
  }
}
