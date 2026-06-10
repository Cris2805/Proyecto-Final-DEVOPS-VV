import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Check,
  CheckSquare,
  CircleDashed,
  Loader2,
  Plus,
  TrendingUp
} from 'lucide-react';
import { checkBackendHealth, getTasks } from '../services/taskService.js';

const statusLabels = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  completada: 'Completado'
};

const priorityLabels = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja'
};

const dotTone = {
  pendiente: 'bg-violet-400',
  en_progreso: 'bg-blue-400',
  completada: 'bg-emerald-400'
};

function getInitials(value = 'TaskFlow') {
  return value
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'TF';
}

function MetricCard({ card }) {
  const Icon = card.icon;

  return (
    <article className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.color} p-5 shadow-2xl shadow-blue-950/25`}>
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/15 blur-xl" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-white/90">{card.label}</p>
          <p className="mt-3 text-4xl font-black text-white">{card.value}</p>
          <p className="mt-4 text-sm text-cyan-100">{card.helper}</p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
          <Icon size={22} />
        </div>
      </div>
    </article>
  );
}

function TaskCard({ task, index, done }) {
  const priority = priorityLabels[task.priority] ?? 'Media';
  const priorityClass =
    task.priority === 'alta'
      ? 'border-red-400/35 bg-red-500/10 text-red-300'
      : task.priority === 'baja'
        ? 'border-emerald-400/35 bg-emerald-500/10 text-emerald-300'
        : 'border-amber-400/35 bg-amber-500/10 text-amber-300';

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-800/55 p-4 shadow-lg shadow-black/15">
      <div className="flex items-start gap-3">
        <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${dotTone[task.status] ?? 'bg-slate-400'}`} />
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold leading-6 text-white">{task.title}</h4>
          <span className="mt-2 inline-flex rounded-lg bg-blue-500/15 px-2.5 py-1 text-xs font-bold text-blue-300">
            {task.project || 'Sin proyecto'}
          </span>
        </div>
        {done && (
          <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-white">
            <Check size={16} />
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-orange-100 to-slate-500 text-[10px] font-black text-slate-950">
            {getInitials(task.responsible || `TF ${index}`)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={14} />
            {task.due_date || 'Sin fecha'}
          </span>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${priorityClass}`}>
          {priority}
        </span>
      </div>
    </article>
  );
}

function ProductivityRing({ metrics }) {
  const productivity = metrics.total === 0 ? 0 : Math.round((metrics.completed / metrics.total) * 100);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/55 p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-black text-white">Productividad del equipo</h3>
        <span className="rounded-lg bg-white/5 px-3 py-1 text-xs text-slate-400">Esta semana</span>
      </div>
      <div className="flex items-center gap-5">
        <div className="grid h-28 w-28 place-items-center rounded-full bg-[conic-gradient(#14B8A6_0_39%,#3B82F6_39%_72%,#8B5CF6_72%_100%)] p-3">
          <div className="grid h-full w-full place-items-center rounded-full bg-[#081225] text-center">
            <div>
              <p className="text-2xl font-black text-white">{productivity}%</p>
              <p className="text-xs text-slate-400">Productividad</p>
            </div>
          </div>
        </div>
        <div className="grid gap-3 text-xs text-slate-300">
          <p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-teal-400" />Completadas {metrics.completed}</p>
          <p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-400" />En progreso {metrics.progress}</p>
          <p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-violet-400" />Pendientes {metrics.pending}</p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState('verificando');
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState('');

  useEffect(() => {
    let active = true;

    checkBackendHealth().then((result) => {
      if (active) setBackendStatus(result.connected ? 'conectado' : 'sin conexion');
    });

    getTasks()
      .then((data) => {
        if (active) {
          setTasks(data);
          setTasksError('');
        }
      })
      .catch(() => {
        if (active) setTasksError('No se pudo conectar con el servidor de tareas.');
      })
      .finally(() => {
        if (active) setLoadingTasks(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const metrics = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter((task) => task.status === 'pendiente').length,
    progress: tasks.filter((task) => task.status === 'en_progreso').length,
    completed: tasks.filter((task) => task.status === 'completada').length
  }), [tasks]);

  const metricCards = [
    { label: 'Total', value: metrics.total, helper: 'tareas registradas', color: 'from-blue-500 to-blue-700', icon: CheckSquare },
    { label: 'Pendientes', value: metrics.pending, helper: 'por iniciar', color: 'from-violet-500 to-purple-700', icon: CircleDashed },
    { label: 'En progreso', value: metrics.progress, helper: 'trabajo activo', color: 'from-sky-500 to-blue-800', icon: TrendingUp },
    { label: 'Completadas', value: metrics.completed, helper: 'cerradas', color: 'from-teal-500 to-cyan-900', icon: Check }
  ];

  const columns = [
    { status: 'pendiente', title: 'Pendiente', count: metrics.pending },
    { status: 'en_progreso', title: 'En progreso', count: metrics.progress },
    { status: 'completada', title: 'Completado', count: metrics.completed }
  ];

  const upcomingTasks = [...tasks]
    .filter((task) => task.due_date)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 3);

  const recentTasks = [...tasks].slice(0, 3);

  return (
    <div className="grid gap-6">
      <div className="flex justify-end">
        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${
          backendStatus === 'conectado'
            ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
            : 'border-slate-400/20 bg-white/5 text-slate-400'
        }`}>
          API: {backendStatus}
        </span>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <MetricCard key={card.label} card={card} />
        ))}
      </section>

      {tasksError && (
        <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-semibold text-red-200">
          {tasksError}
        </div>
      )}

      <section className="grid gap-5 xl:grid-cols-[1fr_300px]">
        <div className="grid gap-4 lg:grid-cols-3">
          {columns.map((column) => {
            const columnTasks = tasks.filter((task) => task.status === column.status);

            return (
              <section key={column.status} className="rounded-2xl border border-white/10 bg-slate-900/55 p-4 shadow-2xl shadow-black/20">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-black text-white">{column.title}</h3>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-slate-300">{column.count}</span>
                  </div>
                  <button
                    className="grid h-8 w-8 place-items-center rounded-xl text-slate-300 hover:bg-white/10"
                    onClick={() => navigate('/tasks', { state: { openNewTask: true, status: column.status } })}
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="grid gap-3">
                  {loadingTasks ? (
                    <div className="grid min-h-32 place-items-center text-sm text-slate-400">
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="animate-spin text-blue-300" size={16} />
                        Cargando...
                      </span>
                    </div>
                  ) : (
                    columnTasks.slice(0, 4).map((task, index) => (
                      <TaskCard key={task.id} task={task} index={index} done={column.status === 'completada'} />
                    ))
                  )}
                  {!loadingTasks && columnTasks.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-center text-sm text-slate-400">
                      Sin tareas por ahora
                    </div>
                  )}
                </div>
                <button
                  className="mt-4 inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white"
                  onClick={() => navigate('/tasks', { state: { openNewTask: true, status: column.status } })}
                >
                  <Plus size={16} />
                  Añadir tarea
                </button>
              </section>
            );
          })}
        </div>

        <aside className="grid gap-4">
          <ProductivityRing metrics={metrics} />
          <section className="rounded-2xl border border-white/10 bg-slate-900/55 p-4">
            <h3 className="mb-4 font-black text-white">Proximos vencimientos</h3>
            {upcomingTasks.map((task) => (
              <div key={task.id} className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.045] p-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-orange-100 to-slate-500 text-[10px] font-black text-slate-950">
                  {getInitials(task.responsible || 'TaskFlow')}
                </span>
                <p className="flex-1 text-xs font-semibold text-slate-200">{task.title}</p>
                <span className="text-xs font-bold text-red-300">{task.due_date}</span>
              </div>
            ))}
            {upcomingTasks.length === 0 && (
              <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">
                No hay vencimientos registrados.
              </div>
            )}
            <button className="text-sm font-bold text-blue-300" onClick={() => navigate('/tasks')}>Ver todas las tareas →</button>
          </section>
          <section className="rounded-2xl border border-white/10 bg-slate-900/55 p-4">
            <h3 className="mb-4 font-black text-white">Actividad reciente</h3>
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 border-b border-white/10 py-3 last:border-0">
                <span className="mt-1 grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-white">
                  <Check size={14} />
                </span>
                <p className="text-xs leading-5 text-slate-300">
                  Tarea creada: {task.title}
                  <span className="block text-slate-500">{statusLabels[task.status]}</span>
                </p>
              </div>
            ))}
            {recentTasks.length === 0 && <p className="text-sm text-slate-400">Sin actividad reciente.</p>}
          </section>
        </aside>
      </section>
    </div>
  );
}
