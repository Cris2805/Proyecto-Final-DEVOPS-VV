import { useEffect, useState } from 'react';
import { Bell, Lock, Moon, Save, ShieldCheck, Users, X } from 'lucide-react';
import { getSettings, updateSettings } from '../services/settingsService.js';
import { applyTheme } from '../services/themeService.js';

function Panel({ children, className = '' }) {
  return <section className={`rounded-2xl border border-white/10 bg-slate-900/55 p-5 shadow-2xl shadow-black/20 ${className}`}>{children}</section>;
}

function Switch({ active = true, onClick }) {
  return (
    <button type="button" onClick={onClick} className={`flex h-7 w-12 items-center rounded-full p-1 transition ${active ? 'bg-blue-600' : 'bg-slate-700'}`}>
      <span className={`h-5 w-5 rounded-full bg-white transition ${active ? 'translate-x-5' : ''}`} />
    </button>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [original, setOriginal] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getSettings().then((data) => {
      setSettings(data);
      setOriginal(data);
    }).catch(() => setMessage('No se pudo cargar la configuracion.'));
  }, []);

  function setField(field, value) {
    setSettings((current) => {
      const next = { ...current, [field]: value };
      if (field === 'theme' || field === 'primary_color') {
        applyTheme(next.theme || 'dark', next.primary_color || 'blue-violet');
      }
      return next;
    });
  }

  async function saveChanges() {
    try {
      const saved = await updateSettings(settings);
      setSettings(saved);
      setOriginal(saved);
      applyTheme(saved.theme || 'dark', saved.primary_color || 'blue-violet');
      setMessage('Cambios guardados correctamente');
    } catch {
      setMessage('No se pudieron guardar los cambios.');
    }
  }

  function cancelChanges() {
    setSettings(original);
    applyTheme(original?.theme || 'dark', original?.primary_color || 'blue-violet');
    setMessage('Cambios restaurados.');
  }

  if (!settings) {
    return <div className="rounded-2xl border border-white/10 bg-slate-900/55 p-5 text-slate-300">Cargando ajustes...</div>;
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-3xl font-black text-white">Ajustes</h2>
          <p className="mt-2 text-slate-400">Administra preferencias y configuracion del workspace.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={cancelChanges} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/65 px-5 py-3 text-sm font-bold text-slate-300"><X size={17} /> Cancelar</button>
          <button onClick={saveChanges} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/30"><Save size={17} /> Guardar cambios</button>
        </div>
      </div>

      {message && <div className="rounded-xl border border-blue-400/30 bg-blue-500/10 p-3 text-sm font-semibold text-blue-100">{message}</div>}

      <section className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <div className="grid gap-5">
          <Panel>
            <div className="mb-4 flex items-center gap-3">
              <Users className="text-cyan-300" size={22} />
              <h3 className="text-lg font-black text-white">Workspace</h3>
            </div>
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-slate-300">
                Nombre del workspace
                <input className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white outline-none" value={settings.workspace_name || ''} onChange={(event) => setField('workspace_name', event.target.value)} />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-300">
                Plan
                <input className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white outline-none" value={settings.plan || ''} onChange={(event) => setField('plan', event.target.value)} />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-300">
                Zona horaria
                <input className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white outline-none" value={settings.timezone || ''} onChange={(event) => setField('timezone', event.target.value)} />
              </label>
            </div>
          </Panel>

          <Panel>
            <h3 className="mb-4 text-lg font-black text-white">Resumen</h3>
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Workspace</span><span className="font-bold text-white">{settings.workspace_name}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Plan</span><span className="font-bold text-violet-300">{settings.plan}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Tema</span><span className="font-bold text-white">{settings.theme}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Idioma</span><span className="font-bold text-white">{settings.language}</span></div>
            </div>
          </Panel>
        </div>

        <div className="grid gap-5">
          <section className="grid gap-5 lg:grid-cols-2">
            <Panel>
              <div className="mb-5 flex items-center gap-3"><Bell className="text-violet-300" size={22} /><h3 className="text-lg font-black text-white">Notificaciones</h3></div>
              {[
                ['Correo electronico', 'email_notifications'],
                ['Actualizaciones de tareas', 'task_notifications'],
                ['Recordatorios de vencimientos', 'deadline_notifications'],
                ['Resumen semanal', 'weekly_summary']
              ].map(([label, field]) => (
                <div key={field} className="flex items-center justify-between border-b border-white/10 py-4 last:border-0">
                  <span className="text-sm font-semibold text-slate-300">{label}</span>
                  <Switch active={Boolean(settings[field])} onClick={() => setField(field, settings[field] ? 0 : 1)} />
                </div>
              ))}
            </Panel>

            <Panel>
              <div className="mb-5 flex items-center gap-3"><Moon className="text-cyan-300" size={22} /><h3 className="text-lg font-black text-white">Apariencia</h3></div>
              <div className="grid gap-4">
                <label className="grid gap-2 text-sm font-semibold text-slate-300">Tema<select className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white" value={settings.theme} onChange={(event) => setField('theme', event.target.value)}><option className="bg-slate-900" value="dark">Modo oscuro</option><option className="bg-slate-900" value="light">Modo claro visual</option></select></label>
                <label className="grid gap-2 text-sm font-semibold text-slate-300">Color principal<select className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white" value={settings.primary_color} onChange={(event) => setField('primary_color', event.target.value)}><option className="bg-slate-900" value="blue-violet">Azul/Violeta</option><option className="bg-slate-900" value="teal">Teal</option><option className="bg-slate-900" value="blue">Azul</option><option className="bg-slate-900" value="violet">Violeta</option></select></label>
                <label className="grid gap-2 text-sm font-semibold text-slate-300">Idioma<input className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white" value={settings.language || ''} onChange={(event) => setField('language', event.target.value)} /></label>
              </div>
            </Panel>
          </section>

          <Panel>
            <div className="mb-5 flex items-center gap-3"><ShieldCheck className="text-emerald-300" size={22} /><h3 className="text-lg font-black text-white">Seguridad general</h3></div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4"><Lock className="text-blue-300" size={22} /><h4 className="mt-4 font-black text-white">Politica de contrasenas</h4><p className="mt-2 text-sm leading-6 text-slate-400">Preparada para una fase posterior.</p></div>
              <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4"><ShieldCheck className="text-blue-300" size={22} /><div className="mt-4 flex items-center justify-between"><h4 className="font-black text-white">Dos pasos</h4><Switch active={Boolean(settings.two_factor_enabled)} onClick={() => setField('two_factor_enabled', settings.two_factor_enabled ? 0 : 1)} /></div><p className="mt-2 text-sm leading-6 text-slate-400">Control guardado en SQLite.</p></div>
              <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4"><Users className="text-blue-300" size={22} /><h4 className="mt-4 font-black text-white">Acceso local</h4><p className="mt-2 text-sm leading-6 text-slate-400">Usuarios gestionados desde Equipo.</p></div>
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}
