import { useState } from 'react';
import { LogOut, Save, ShieldCheck, User, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/apiService.js';
import { updateUser } from '../services/userService.js';

function Panel({ children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-white/10 bg-slate-900/55 p-5 shadow-2xl shadow-black/20 ${className}`}>
      {children}
    </section>
  );
}

function getInitials(user) {
  return user?.avatar_initials || user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'TF';
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getCurrentUser() || {});
  const [form, setForm] = useState(() => ({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    department: user?.department || '',
    status: user?.status || 'activo'
  }));
  const [message, setMessage] = useState('');

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function saveProfile() {
    if (!user?.id) {
      setMessage('No hay usuario autenticado para actualizar.');
      return;
    }

    try {
      const updated = await updateUser(user.id, {
        ...user,
        ...form,
        password: ''
      });
      localStorage.setItem('taskflow_user', JSON.stringify(updated));
      setUser(updated);
      setMessage('Perfil actualizado correctamente.');
    } catch {
      setMessage('No se pudo actualizar el perfil.');
    }
  }

  function logout() {
    localStorage.removeItem('taskflow_user');
    navigate('/login');
  }

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-3xl font-black text-white">Perfil</h2>
        <p className="mt-2 text-slate-400">Administra tu informacion personal.</p>
      </div>

      {message && (
        <div className="rounded-xl border border-blue-400/30 bg-blue-500/10 p-3 text-sm font-semibold text-blue-100">
          {message}
        </div>
      )}

      <section className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <div className="grid gap-5">
          <Panel>
            <div className="flex flex-col items-center text-center">
              <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 text-2xl font-black text-white shadow-2xl shadow-blue-950/40">
                {getInitials(user)}
              </div>
              <h3 className="mt-5 text-2xl font-black text-white">{user?.name || 'Usuario TaskFlow'}</h3>
              <p className="mt-1 text-sm text-slate-400">{user?.email || 'Sin correo'}</p>
              <span className="mt-4 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-300">
                {user?.role || 'Miembro'}
              </span>
              <button
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-3 text-sm font-black text-white"
                onClick={saveProfile}
              >
                <Save size={17} /> Editar perfil
              </button>
            </div>
          </Panel>

          <Panel>
            <div className="mb-4 flex items-center gap-3">
              <ShieldCheck className="text-cyan-300" size={22} />
              <h3 className="text-lg font-black text-white">Informacion de sesion</h3>
            </div>
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Usuario autenticado</span>
                <span className="text-right font-bold text-white">{user?.email || 'No disponible'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tipo de acceso</span>
                <span className="font-bold text-blue-300">Local SQLite</span>
              </div>
              <button
                onClick={logout}
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200"
              >
                <LogOut size={17} /> Cerrar sesion
              </button>
            </div>
          </Panel>
        </div>

        <div className="grid gap-5">
          <Panel>
            <div className="mb-5 flex items-center gap-3">
              <User className="text-blue-300" size={22} />
              <h3 className="text-lg font-black text-white">Datos personales</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-slate-300">
                Nombre completo
                <input className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white outline-none" value={form.name} onChange={(event) => updateField('name', event.target.value)} />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-300">
                Correo
                <input className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white outline-none" value={form.email} onChange={(event) => updateField('email', event.target.value)} />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-300">
                Rol
                <input className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white outline-none" value={form.role} onChange={(event) => updateField('role', event.target.value)} />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-300">
                Estado
                <select className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white outline-none" value={form.status} onChange={(event) => updateField('status', event.target.value)}>
                  <option className="bg-slate-900" value="activo">Activo</option>
                  <option className="bg-slate-900" value="inactivo">Inactivo</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-300 md:col-span-2">
                Departamento
                <input className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white outline-none" value={form.department} onChange={(event) => updateField('department', event.target.value)} />
              </label>
            </div>
          </Panel>

          <Panel>
            <div className="mb-5 flex items-center gap-3">
              <UserRound className="text-violet-300" size={22} />
              <h3 className="text-lg font-black text-white">Cambiar contrasena</h3>
            </div>
            <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-slate-400">
              Esta seccion queda preparada visualmente. Para esta entrega academica el acceso local SQLite funciona con usuario y contrasena registrados desde Equipo.
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}
