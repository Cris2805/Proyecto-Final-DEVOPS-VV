import { useEffect, useMemo, useState } from 'react';
import { Activity, Edit3, Mail, Plus, Trash2, TrendingUp, UserCheck, Users } from 'lucide-react';
import Modal from '../components/ui/Modal.jsx';
import { createUser, deleteUser, getUsers, updateUser } from '../services/userService.js';

const emptyUser = {
  name: '',
  email: '',
  password: '',
  role: 'Miembro',
  department: '',
  workload: 0,
  productivity: 0,
  assigned_tasks: 0,
  status: 'activo'
};

function Panel({ children, className = '' }) {
  return <section className={`rounded-2xl border border-white/10 bg-slate-900/55 p-5 shadow-2xl shadow-black/20 ${className}`}>{children}</section>;
}

function initials(name = 'TF') {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'TF';
}

export default function Team() {
  const [members, setMembers] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyUser);
  const [message, setMessage] = useState('');

  async function loadUsers() {
    setMembers(await getUsers());
  }

  useEffect(() => {
    loadUsers().catch(() => setMessage('No se pudo cargar el equipo.'));
  }, []);

  const kpiValues = useMemo(() => {
    const active = members.filter((member) => member.status === 'activo').length;
    const assigned = members.reduce((sum, member) => sum + Number(member.assigned_tasks || 0), 0);
    const avgLoad = members.length ? Math.round(members.reduce((sum, member) => sum + Number(member.workload || 0), 0) / members.length) : 0;
    const avgProductivity = members.length ? Math.round(members.reduce((sum, member) => sum + Number(member.productivity || 0), 0) / members.length) : 0;
    return { active, assigned, avgLoad, avgProductivity };
  }, [members]);

  const kpis = [
    ['Miembros activos', kpiValues.active, 'from-blue-500 to-blue-700', Users],
    ['Tareas asignadas', kpiValues.assigned, 'from-violet-500 to-purple-700', UserCheck],
    ['Capacidad promedio', `${kpiValues.avgLoad}%`, 'from-teal-500 to-cyan-800', Activity],
    ['Productividad', `${kpiValues.avgProductivity}%`, 'from-sky-500 to-blue-900', TrendingUp]
  ];

  function openPanel(member = null) {
    setEditing(member);
    setForm(member ? { ...emptyUser, ...member, password: '' } : emptyUser);
    setPanelOpen(true);
    setMessage('');
  }

  async function saveUser(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setMessage('Nombre y correo son obligatorios.');
      return;
    }
    if (editing) await updateUser(editing.id, form);
    else await createUser(form);
    await loadUsers();
    setPanelOpen(false);
    setEditing(null);
    setForm(emptyUser);
  }

  async function removeUser(member) {
    if (!window.confirm(`Eliminar a "${member.name}"?`)) return;
    await deleteUser(member.id);
    await loadUsers();
  }

  return (
    <div className="grid gap-5">
      <section className="grid gap-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-3xl font-black text-white">Equipo</h2>
            <p className="mt-2 text-slate-400">Revisa miembros, roles y capacidad del equipo.</p>
          </div>
          <button onClick={() => openPanel()} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/30">
            Invitar miembro <Plus size={18} />
          </button>
        </div>

        {message && <div className="rounded-xl border border-blue-400/30 bg-blue-500/10 p-3 text-sm font-semibold text-blue-100">{message}</div>}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map(([label, value, color, Icon]) => (
            <article key={label} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-5 shadow-2xl shadow-black/20`}>
              <div className="relative flex items-start justify-between">
                <div><p className="text-sm font-semibold text-white/90">{label}</p><p className="mt-3 text-4xl font-black text-white">{value}</p><p className="mt-4 text-xs text-cyan-100">Datos desde SQLite</p></div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15"><Icon size={22} /></div>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_330px]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {members.map((member) => (
              <Panel key={member.id}>
                <div className="flex items-start gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-orange-100 to-slate-500 text-sm font-black text-slate-950">{member.avatar_initials || initials(member.name)}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div><h3 className="font-black text-white">{member.name}</h3><p className="mt-1 text-sm text-slate-400">{member.role}</p></div>
                      <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-300">{member.status}</span>
                    </div>
                    <p className="mt-3 inline-flex items-center gap-2 text-xs text-slate-500"><Mail size={14} /> {member.email}</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/[0.045] p-3"><p className="text-xs text-slate-500">Tareas</p><p className="mt-1 text-xl font-black text-white">{member.assigned_tasks || 0}</p></div>
                  <div className="rounded-xl bg-white/[0.045] p-3"><p className="text-xs text-slate-500">Productividad</p><p className="mt-1 text-xl font-black text-white">{member.productivity || 0}%</p></div>
                </div>
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-sm"><span className="text-slate-400">Carga de trabajo</span><span className="font-bold text-white">{member.workload || 0}%</span></div>
                  <div className="h-2.5 rounded-full bg-slate-800"><div className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400" style={{ width: `${member.workload || 0}%` }} /></div>
                </div>
                <div className="mt-5 flex gap-2">
                  <button onClick={() => openPanel(member)} className="flex-1 rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-slate-200"><Edit3 className="mr-2 inline" size={15} />Editar</button>
                  <button onClick={() => removeUser(member)} className="rounded-xl border border-red-400/20 px-3 py-2 text-red-300"><Trash2 size={16} /></button>
                </div>
              </Panel>
            ))}
          </div>

          <aside className="grid gap-4">
            <Panel>
              <h3 className="mb-4 text-lg font-black text-white">Carga del equipo</h3>
              {members.map((member) => (
                <div key={member.id} className="mb-4 last:mb-0">
                  <div className="mb-2 flex justify-between text-sm"><div><p className="font-bold text-white">{member.name}</p><p className="text-xs text-slate-500">{member.department || member.role}</p></div><span className="font-bold text-slate-300">{member.workload || 0}%</span></div>
                  <div className="h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-gradient-to-r from-teal-400 to-blue-500" style={{ width: `${member.workload || 0}%` }} /></div>
                </div>
              ))}
            </Panel>
          </aside>
        </section>
      </section>

      <Modal
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        title={editing ? 'Editar usuario' : 'Nuevo usuario'}
        size="md"
      >
          <form onSubmit={saveUser} className="grid gap-4">
            {['name', 'email', ...(editing ? [] : ['password']), 'role', 'department'].map((field) => (
              <label key={field} className="grid gap-2 text-sm font-semibold text-slate-300">
                {field === 'name' ? 'Nombre' : field === 'email' ? 'Correo' : field === 'password' ? 'Contrasena' : field === 'role' ? 'Rol' : 'Departamento'}
                <input type={field === 'password' ? 'password' : 'text'} className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white outline-none" value={form[field] ?? ''} onChange={(event) => setForm({ ...form, [field]: event.target.value })} placeholder={editing && field === 'password' ? 'Dejar vacio para conservar' : ''} />
              </label>
            ))}
            {['assigned_tasks', 'workload', 'productivity'].map((field) => (
              <label key={field} className="grid gap-2 text-sm font-semibold text-slate-300">
                {field === 'assigned_tasks' ? 'Tareas asignadas' : field === 'workload' ? 'Carga de trabajo' : 'Productividad'}: {form[field]}
                <input type="range" min="0" max={field === 'assigned_tasks' ? 50 : 100} value={form[field] ?? 0} onChange={(event) => setForm({ ...form, [field]: Number(event.target.value) })} />
              </label>
            ))}
            <label className="grid gap-2 text-sm font-semibold text-slate-300">
              Estado
              <select className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                <option className="bg-slate-900" value="activo">Activo</option>
                <option className="bg-slate-900" value="inactivo">Inactivo</option>
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button type="button" onClick={() => setPanelOpen(false)} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300">Cancelar</button>
              <button className="rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-3 text-sm font-black text-white">Guardar usuario</button>
            </div>
          </form>
      </Modal>
    </div>
  );
}
