import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  CalendarDays,
  Check,
  ChevronDown,
  Edit3,
  Filter,
  Loader2,
  Plus,
  Search,
  Settings2,
  Trash2
} from 'lucide-react';
import Modal from '../components/ui/Modal.jsx';
import {
  createTask,
  createSubtask,
  deleteTask,
  deleteSubtask,
  getSubtasks,
  getTasks,
  toggleSubtask,
  updateTask,
  updateTaskStatus
} from '../services/taskService.js';

const emptyForm = {
  title: '',
  description: '',
  status: 'pendiente',
  priority: 'media',
  responsible: '',
  project: '',
  due_date: '',
  tags: ''
};

const statusLabels = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  completada: 'Completada'
};

const priorityLabels = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja'
};

const toneClass = {
  pendiente: 'bg-violet-400',
  en_progreso: 'bg-blue-400',
  completada: 'bg-emerald-400'
};

const statusClass = {
  pendiente: 'border-violet-400/25 bg-violet-500/15 text-violet-300',
  en_progreso: 'border-blue-400/25 bg-blue-500/15 text-blue-300',
  completada: 'border-emerald-400/25 bg-emerald-500/15 text-emerald-300'
};

const priorityClass = {
  alta: 'border-red-400/35 bg-red-500/10 text-red-300',
  media: 'border-amber-400/35 bg-amber-500/10 text-amber-300',
  baja: 'border-emerald-400/35 bg-emerald-500/10 text-emerald-300'
};

function Avatar({ name = 'TaskFlow' }) {
  return (
    <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-orange-100 to-slate-500 text-[10px] font-black text-slate-950">
      {name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'TF'}
    </span>
  );
}

function mapTaskToForm(task) {
  return {
    title: task.title ?? '',
    description: task.description ?? '',
    status: task.status ?? 'pendiente',
    priority: task.priority ?? 'media',
    responsible: task.responsible ?? '',
    project: task.project ?? '',
    due_date: task.due_date ?? '',
    tags: task.tags ?? ''
  };
}

function normalizeError(error) {
  if (error.message === 'El titulo de la tarea es obligatorio') {
    return 'El titulo de la tarea es obligatorio.';
  }

  return error.message || 'Ocurrio un error al procesar la tarea.';
}

export default function Tasks() {
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [priorityFilter, setPriorityFilter] = useState('todas');
  const [sortBy, setSortBy] = useState('recent');
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [subtaskLoading, setSubtaskLoading] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState(emptyForm);

  async function loadTasks() {
    try {
      setLoading(true);
      setError('');
      const data = await getTasks();
      setTasks(data);
    } catch (loadError) {
      setError(loadError.message || 'No se pudo conectar con el servidor de tareas.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (location.state?.openNewTask) {
      setEditingTask(null);
      setForm({ ...emptyForm, status: location.state.status ?? 'pendiente' });
      setFormError('');
      setActiveTab('details');
      setPanelOpen(true);
    }
  }, [location.state]);

  async function loadSubtasks(taskId) {
    if (!taskId) return;
    try {
      setSubtaskLoading(true);
      setSubtasks(await getSubtasks(taskId));
    } catch {
      setSubtasks([]);
    } finally {
      setSubtaskLoading(false);
    }
  }

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    const priorityWeight = { alta: 1, media: 2, baja: 3 };
    const list = tasks.filter((task) => {
      const matchesSearch =
        !query ||
        [task.title, task.description, task.responsible, task.project, task.tags]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));

      const matchesStatus = statusFilter === 'todos' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'todas' || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    return list.sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === 'due_date') return new Date(a.due_date || '9999-12-31') - new Date(b.due_date || '9999-12-31');
      if (sortBy === 'priority') return (priorityWeight[a.priority] ?? 9) - (priorityWeight[b.priority] ?? 9);
      if (sortBy === 'az') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'za') return (b.title || '').localeCompare(a.title || '');
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [tasks, search, statusFilter, priorityFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / 10));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * 10;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + 10);

  function openNewTaskPanel() {
    setEditingTask(null);
    setForm(emptyForm);
    setFormError('');
    setActiveTab('details');
    setSubtasks([]);
    setPanelOpen(true);
  }

  function openEditTaskPanel(task) {
    setEditingTask(task);
    setForm(mapTaskToForm(task));
    setFormError('');
    setActiveTab('details');
    loadSubtasks(task.id);
    setPanelOpen(true);
  }

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setFormError('El titulo de la tarea es obligatorio.');
      return;
    }

    try {
      setSaving(true);
      setFormError('');

      const payload = {
        ...form,
        title: form.title.trim(),
        tags: form.tags.trim()
      };

      if (editingTask) {
        await updateTask(editingTask.id, payload);
      } else {
        await createTask(payload);
      }

      await loadTasks();
      setPanelOpen(false);
      setEditingTask(null);
      setForm(emptyForm);
      setSubtasks([]);
    } catch (submitError) {
      setFormError(normalizeError(submitError));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(task) {
    const confirmed = window.confirm(`Eliminar la tarea "${task.title}"?`);

    if (!confirmed) return;

    try {
      await deleteTask(task.id);
      await loadTasks();
      if (editingTask?.id === task.id) {
        setPanelOpen(false);
        setEditingTask(null);
      }
    } catch (deleteError) {
      setError(deleteError.message || 'No se pudo eliminar la tarea.');
    }
  }

  async function handleStatusChange(task, status) {
    try {
      await updateTaskStatus(task.id, status);
      await loadTasks();
    } catch (statusError) {
      setError(statusError.message || 'No se pudo actualizar el estado de la tarea.');
    }
  }

  async function handleAddSubtask() {
    if (!editingTask || !subtaskTitle.trim()) return;
    await createSubtask(editingTask.id, subtaskTitle);
    setSubtaskTitle('');
    await loadSubtasks(editingTask.id);
  }

  async function handleToggleSubtask(subtask) {
    await toggleSubtask(subtask.id);
    await loadSubtasks(editingTask.id);
  }

  async function handleDeleteSubtask(subtask) {
    await deleteSubtask(subtask.id);
    await loadSubtasks(editingTask.id);
  }

  return (
    <div className="grid gap-5">
      <section className="grid gap-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-slate-400">
            <Search size={18} />
            <input
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              placeholder="Buscar tareas..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm font-bold text-slate-200">
            <Filter size={17} /> Filtros <span className="rounded-full bg-white/10 px-2 text-xs">2</span>
          </button>
          <label className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm font-bold text-slate-200">
            Estado:
            <select
              className="bg-transparent text-slate-100 outline-none"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option className="bg-slate-900" value="todos">Todos</option>
              <option className="bg-slate-900" value="pendiente">Pendiente</option>
              <option className="bg-slate-900" value="en_progreso">En progreso</option>
              <option className="bg-slate-900" value="completada">Completada</option>
            </select>
            <ChevronDown size={16} />
          </label>
          <label className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm font-bold text-slate-200">
            Ordenar:
            <select
              className="bg-transparent text-slate-100 outline-none"
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                setPage(1);
              }}
            >
              <option className="bg-slate-900" value="recent">Mas recientes</option>
              <option className="bg-slate-900" value="oldest">Mas antiguas</option>
              <option className="bg-slate-900" value="due_date">Fecha limite proxima</option>
              <option className="bg-slate-900" value="priority">Prioridad alta primero</option>
              <option className="bg-slate-900" value="az">A-Z</option>
              <option className="bg-slate-900" value="za">Z-A</option>
            </select>
            <ChevronDown size={16} />
          </label>
          <button
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/30"
            onClick={openNewTaskPanel}
          >
            Nueva tarea <Plus size={18} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {[
            ['todas', 'Todas'],
            ['alta', 'Alta'],
            ['media', 'Media'],
            ['baja', 'Baja']
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setPriorityFilter(value)}
              className={`rounded-full border px-5 py-2 text-sm font-bold ${
                priorityFilter === value
                  ? 'border-blue-400/50 bg-blue-500/15 text-blue-300'
                  : value === 'alta'
                    ? priorityClass.alta
                    : value === 'media'
                      ? priorityClass.media
                      : value === 'baja'
                        ? priorityClass.baja
                        : 'border-white/10 bg-slate-900/60 text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            className="text-sm font-bold text-blue-300"
            onClick={() => {
              setSearch('');
              setStatusFilter('todos');
              setPriorityFilter('todas');
              setSortBy('recent');
              setPage(1);
            }}
          >
            Limpiar filtros
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-semibold text-red-200">
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/55 shadow-2xl shadow-black/20">
          {loading ? (
            <div className="grid min-h-72 place-items-center text-slate-300">
              <span className="inline-flex items-center gap-3">
                <Loader2 className="animate-spin text-blue-300" size={22} />
                Cargando tareas...
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[930px] border-collapse text-left">
                <thead className="bg-white/[0.025] text-sm text-slate-300">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Tarea</th>
                    <th className="px-5 py-4 font-semibold">Responsable</th>
                    <th className="px-5 py-4 font-semibold">Estado</th>
                    <th className="px-5 py-4 font-semibold">Prioridad</th>
                    <th className="px-5 py-4 font-semibold">Fecha limite</th>
                    <th className="px-5 py-4 text-right"><Settings2 size={18} /></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-t border-white/8 bg-slate-900/35 transition hover:bg-white/[0.035]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-1 h-4 w-4 rounded border border-slate-600" />
                          <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${toneClass[task.status] ?? 'bg-slate-400'}`} />
                          <div>
                            <p className="text-sm font-bold text-white">{task.title}</p>
                            <p className="mt-1 text-xs text-slate-500">{task.project || 'Sin proyecto'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={task.responsible || 'TaskFlow'} />
                          <span className="text-sm font-medium text-slate-200">{task.responsible || 'Sin responsable'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full border px-3 py-1.5 text-xs font-bold ${statusClass[task.status]}`}>
                          {statusLabels[task.status] ?? 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full border px-4 py-1.5 text-xs font-bold ${priorityClass[task.priority]}`}>
                          {task.priority === 'alta' ? '↑' : task.priority === 'media' ? '-' : '+'} {priorityLabels[task.priority]}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-200">{task.due_date || 'Sin fecha'}</td>
                      <td className="px-5 py-4 text-right text-slate-400" onClick={(event) => event.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {task.status === 'completada' && <Check size={16} className="text-emerald-300" />}
                          <button
                            className="rounded-lg p-2 text-blue-300 transition hover:bg-blue-500/10"
                            onClick={() => openEditTaskPanel(task)}
                            title="Editar tarea"
                          >
                            <Edit3 size={17} />
                          </button>
                          <button
                            className="rounded-lg p-2 text-red-300 transition hover:bg-red-500/10"
                            onClick={() => handleDelete(task)}
                            title="Eliminar tarea"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-5 py-12 text-center text-sm text-slate-400">
                        No hay tareas para mostrar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>
            Mostrando {filteredTasks.length === 0 ? 0 : startIndex + 1} a {Math.min(startIndex + 10, filteredTasks.length)} de {filteredTasks.length} tareas
          </span>
          <div className="flex items-center gap-2">
            <button
              className="h-9 rounded-xl bg-slate-900/70 px-3 font-bold text-slate-300 disabled:opacity-40"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              Anterior
            </button>
            <button className="h-9 w-9 rounded-xl bg-blue-600 font-bold text-white">{currentPage}</button>
            <button
              className="h-9 rounded-xl bg-slate-900/70 px-3 font-bold text-slate-300 disabled:opacity-40"
              disabled={currentPage === totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            >
              Siguiente
            </button>
          </div>
        </div>
      </section>

      <Modal
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        title={editingTask ? 'Editar tarea' : 'Nueva tarea'}
        size="lg"
      >
          <form onSubmit={handleSubmit}>
            <div className="mb-5 flex gap-6 border-b border-white/10 text-sm font-bold">
              <button
                type="button"
                className={`${activeTab === 'details' ? 'border-b-2 border-blue-400 text-white' : 'text-slate-500'} pb-3`}
                onClick={() => setActiveTab('details')}
              >
                Detalles
              </button>
              <button
                type="button"
                className={`${activeTab === 'subtasks' ? 'border-b-2 border-blue-400 text-white' : 'text-slate-500'} pb-3`}
                onClick={() => setActiveTab('subtasks')}
              >
                Subtareas
              </button>
            </div>

            {formError && (
              <div className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm font-semibold text-red-200">
                {formError}
              </div>
            )}

            {activeTab === 'details' ? (
            <div className="grid gap-5">
              <label className="grid gap-2 text-sm font-semibold text-slate-300">
                Titulo de la tarea *
                <input
                  className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-white outline-none focus:border-blue-400/60"
                  value={form.title}
                  onChange={(event) => updateForm('title', event.target.value)}
                  placeholder="Titulo de la tarea"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-300">
                Descripcion
                <textarea
                  className="min-h-28 rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-blue-400/60"
                  value={form.description}
                  onChange={(event) => updateForm('description', event.target.value)}
                  placeholder="Descripcion breve"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-300">
                Fecha limite
                <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3">
                  <CalendarDays size={17} className="text-slate-400" />
                  <input
                    type="date"
                    className="w-full bg-transparent text-sm text-white outline-none"
                    value={form.due_date}
                    onChange={(event) => updateForm('due_date', event.target.value)}
                  />
                </span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-2 text-sm font-semibold text-slate-300">
                  Estado
                  <select
                    className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-white outline-none"
                    value={form.status}
                    onChange={(event) => updateForm('status', event.target.value)}
                  >
                    <option className="bg-slate-900" value="pendiente">Pendiente</option>
                    <option className="bg-slate-900" value="en_progreso">En progreso</option>
                    <option className="bg-slate-900" value="completada">Completada</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-300">
                  Prioridad
                  <select
                    className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-white outline-none"
                    value={form.priority}
                    onChange={(event) => updateForm('priority', event.target.value)}
                  >
                    <option className="bg-slate-900" value="alta">Alta</option>
                    <option className="bg-slate-900" value="media">Media</option>
                    <option className="bg-slate-900" value="baja">Baja</option>
                  </select>
                </label>
              </div>
              <label className="grid gap-2 text-sm font-semibold text-slate-300">
                Responsable
                <input
                  className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-white outline-none"
                  value={form.responsible}
                  onChange={(event) => updateForm('responsible', event.target.value)}
                  placeholder="Carlos Mendoza"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-300">
                Proyecto
                <input
                  className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-white outline-none"
                  value={form.project}
                  onChange={(event) => updateForm('project', event.target.value)}
                  placeholder="TaskFlow"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-300">
                Etiquetas
                <input
                  className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-white outline-none"
                  value={form.tags}
                  onChange={(event) => updateForm('tags', event.target.value)}
                  placeholder="frontend,qa,devops"
                />
              </label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300"
                  onClick={() => {
                    setPanelOpen(false);
                    setEditingTask(null);
                    setForm(emptyForm);
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving && <Loader2 className="animate-spin" size={16} />}
                  {editingTask ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </div>
            ) : (
              <div className="grid gap-4">
                {!editingTask ? (
                  <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
                    Guarda la tarea primero para agregar subtareas.
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-white outline-none"
                        value={subtaskTitle}
                        onChange={(event) => setSubtaskTitle(event.target.value)}
                        placeholder="Nueva subtarea"
                      />
                      <button className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white" type="button" onClick={handleAddSubtask}>
                        Agregar
                      </button>
                    </div>
                    {subtaskLoading ? (
                      <p className="text-sm text-slate-400">Cargando subtareas...</p>
                    ) : subtasks.length === 0 ? (
                      <p className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">
                        Sin subtareas por ahora.
                      </p>
                    ) : (
                      subtasks.map((subtask) => (
                        <div key={subtask.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                          <button
                            type="button"
                            className={`grid h-6 w-6 place-items-center rounded-full border ${subtask.completed ? 'border-emerald-400 bg-emerald-500 text-white' : 'border-slate-500 text-transparent'}`}
                            onClick={() => handleToggleSubtask(subtask)}
                          >
                            <Check size={14} />
                          </button>
                          <span className={`flex-1 text-sm ${subtask.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                            {subtask.title}
                          </span>
                          <button type="button" className="text-red-300" onClick={() => handleDeleteSubtask(subtask)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            )}
          </form>
      </Modal>
    </div>
  );
}
