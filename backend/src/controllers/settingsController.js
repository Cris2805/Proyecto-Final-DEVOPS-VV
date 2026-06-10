import { getSettings, updateSettings } from '../models/settingsModel.js';

function ok(res, code, message, data = null) {
  res.status(code).json({ success: true, message, data });
}

function fail(res, code, message) {
  res.status(code).json({ success: false, message });
}

export async function getSettingsController(req, res) {
  try {
    ok(res, 200, 'Configuracion obtenida correctamente', await getSettings());
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al obtener configuracion');
  }
}

export async function putSettingsController(req, res) {
  try {
    ok(res, 200, 'Cambios guardados correctamente', await updateSettings(req.body));
  } catch (error) {
    console.error(error);
    fail(res, 500, 'Error interno al guardar configuracion');
  }
}
