import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, Edit3, FolderKanban, Plus, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal.jsx';
import { createProject, deleteProject, getProjects, updateProject } from '../services/projectService.js';

const emptyProject = {
  name: '',
  description: '',
  status: 'en_progreso',
  priority: 'media',
  progress: 0,
  owner: '',
  due_date: '',
  category: ''
};

const statusLabels = {
  planificado: 'Planificado',
  en_progreso: 'En progreso',
  completado: 'Completado',
  pausado: 'Pausado'
};

const priorityClass = {
  alta: 'border-red-400/35 bg-red-500/10 text-red-300',
  media: 'border-amber-400/35 bg-amber-500/10 text-amber-300',
  baja: 'border-emerald-400/35 bg-emerald-500/10 text-emerald-300'
};

function Panel({ children, className = '' }) {
  return <section className={`rounded-2xl border border-white/10 bg-slate-900/55 p-5 shadow-2xl shadow-black/20 ${className}`}>{children}</section>;
}

function initials(name = 'TF') {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'TF';
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProject);
  const [message, setMessage] = useState('');

  async function loadProjects() {
    setProjects(await getProjects());
  }

  useEffect(() => {
    loadProjects().catch(() => setMessage('No se pudo cargar proyectos.'));
  }, []);

  const metrics = useMemo(() => ({
    total: projects.length,
    progress: projects.filter((project) => project.status === 'en_progreso').length,
    completed: projects.filter((project) => project.status === 'completado').length,
    dueSoon: projects.filter((project) => project.due_date).slice(0, 4).length
  }), [projects]);

  function openPanel(project = null) {
    setEditing(project);
    setForm(project ? { ...emptyProject, ...project } : emptyProject);
    setPanelOpen(true);
    setMessage('');
  }

  async function saveProject(event) {
    event.preventDefault();
    if (!form.name.trim()) {
      setMessage('El nombre del proyecto es obligatorio.');
      return;
    }
    if (editing) await updateProject(editing.id, form);
    else await createProject(form);
    await loadProjects();
    setPanelOpen(false);
    setEditing(null);
    setForm(emptyProject);
  }

  async function removeProject(project) {
    if (!window.confirm(`Eliminar el proyecto "${project.name}"?`)) return;
    await deleteProject(project.id);
    await loadProjects();
  }

  const kpis = [
    ['Total proyectos', metrics.total, 'from-blue-500 to-blue-700', FolderKanban],
    ['En progreso', metrics.progress, 'from-violet-500 to-purple-700', Clock3],
    ['Completados', metrics.completed, 'from-teal-500 to-cyan-800', CheckCircle2],
    ['Proximos a vencer', metrics.dueSoon, 'from-orange-500 to-red-600', CalendarDays]
  ];

  return (
    <div className="grid gap-5">
      <section className="grid gap-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-3xl font-black text-white">Proyectos</h2>
            <p className="mt-2 text-slate-400">Agrupa iniciativas, entregables y responsables.</p>
          </div>
          <button onClick={() => openPanel()} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/30">
            Nuevo proyecto <Plus size={18} />
          </button>
        </div>

        {message && <div className="rounded-xl border border-blue-400/30 bg-blue-500/10 p-3 text-sm font-semibold text-blue-100">{message}</div>}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map(([label, value, color, Icon]) => (
            <article key={label} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-5 shadow-2xl shadow-black/20`}>
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-white/90">{label}</p>
                  <p className="mt-3 text-4xl font-black text-white">{value}</p>
                  <p className="mt-4 text-xs text-cyan-100">Datos desde SQLite</p>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15"><Icon size={22} /></div>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <Panel key={project.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-white">{project.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{project.description || 'Sin descripcion'}</p>
                  </div>
                  <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">{statusLabels[project.status]}</span>
                </div>
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-sm"><span className="text-slate-400">Progreso</span><span className="font-bold text-white">{project.progress}%</span></div>
                  <div className="h-2.5 rounded-full bg-slate-800"><div className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400" style={{ width: `${project.progress}%` }} /></div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-slate-100 to-slate-500 text-[10px] font-black text-slate-950">{initials(project.owner)}</span>
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold ${priorityClass[project.priority]}`}>{project.priority}</span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-300">
                  <p className="inline-flex items-center gap-2"><CalendarDays size={16} className="text-blue-300" />{project.due_date || 'Sin fecha'}</p>
                  <p className="inline-flex items-center gap-2"><FolderKanban size={16} className="text-violet-300" />{project.category || 'General'}</p>
                </div>
                <div className="mt-5 flex gap-2">
                  <button onClick={() => openPanel(project)} className="flex-1 rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-slate-200"><Edit3 className="mr-2 inline" size={15} />Editar</button>
                  <button onClick={() => removeProject(project)} className="rounded-xl border border-red-400/20 px-3 py-2 text-red-300"><Trash2 size={16} /></button>
                </div>
              </Panel>
            ))}
          </div>

          <aside className="grid gap-4">
            <Panel>
              <h3 className="mb-4 text-lg font-black text-white">Proximos hitos</h3>
              {projects.filter((project) => project.due_date).slice(0, 5).map((project) => (
                <div key={project.id} className="mb-3 rounded-xl bg-white/[0.045] p-3">
                  <div className="flex justify-between gap-3">
                    <div><p className="text-sm font-bold text-white">{project.name}</p><p className="mt-1 text-xs text-slate-500">{project.owner || 'Sin responsable'}</p></div>
                    <span className="h-fit rounded-lg bg-blue-500/15 px-2 py-1 text-xs font-bold text-blue-300">{project.due_date}</span>
                  </div>
                </div>
              ))}
            </Panel>
          </aside>
        </section>
      </section>

      <Modal
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        title={editing ? 'Editar proyecto' : 'Nuevo proyecto'}
        size="md"
      >
          <form onSubmit={saveProject} className="grid gap-4">
            {['name', 'description', 'owner', 'due_date', 'category'].map((field) => (
              <label key={field} className="grid gap-2 text-sm font-semibold text-slate-300">
                {field === 'name' ? 'Nombre' : field === 'description' ? 'Descripcion' : field === 'owner' ? 'Responsable' : field === 'due_date' ? 'Fecha limite' : 'Categoria'}
                <input type={field === 'due_date' ? 'date' : 'text'} className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white outline-none" value={form[field] ?? ''} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />
              </label>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <select className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                <option className="bg-slate-900" value="planificado">Planificado</option>
                <option className="bg-slate-900" value="en_progreso">En progreso</option>
                <option className="bg-slate-900" value="completado">Completado</option>
                <option className="bg-slate-900" value="pausado">Pausado</option>
              </select>
              <select className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
                <option className="bg-slate-900" value="alta">Alta</option>
                <option className="bg-slate-900" value="media">Media</option>
                <option className="bg-slate-900" value="baja">Baja</option>
              </select>
            </div>
            <label className="grid gap-2 text-sm font-semibold text-slate-300">Progreso {form.progress}%<input type="range" min="0" max="100" value={form.progress} onChange={(event) => setForm({ ...form, progress: Number(event.target.value) })} /></label>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button type="button" onClick={() => setPanelOpen(false)} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300">Cancelar</button>
              <button className="rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-3 text-sm font-black text-white">Guardar proyecto</button>
            </div>
          </form>
      </Modal>
    </div>
  );
}
