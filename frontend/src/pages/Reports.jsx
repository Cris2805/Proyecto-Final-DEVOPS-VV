import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Check, ChevronDown, Clock3, Download, Folder, Target } from 'lucide-react';
import { getReportSummary } from '../services/reportService.js';

function KpiCard({ label, value, helper, color, Icon }) {
  return (
    <article className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-5 shadow-2xl shadow-black/20`}>
      <div className="relative flex items-start justify-between">
        <div><p className="text-sm font-semibold text-white/90">{label}</p><p className="mt-3 text-3xl font-black text-white">{value}</p><p className="mt-4 text-xs text-cyan-100">{helper}</p></div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15"><Icon size={21} /></div>
      </div>
    </article>
  );
}

function Panel({ children, className = '' }) {
  return <section className={`rounded-2xl border border-white/10 bg-slate-900/55 p-5 shadow-2xl shadow-black/20 ${className}`}>{children}</section>;
}

function Donut({ center, labels }) {
  return (
    <div className="flex items-center justify-center gap-7">
      <div className="grid h-36 w-36 place-items-center rounded-full bg-[conic-gradient(#14B8A6_0_39%,#3B82F6_39%_67%,#8B5CF6_67%_100%)] p-4">
        <div className="grid h-full w-full place-items-center rounded-full bg-[#081225] text-center"><div><p className="text-2xl font-black text-white">{center}</p><p className="text-xs text-slate-400">Total</p></div></div>
      </div>
      <div className="grid gap-3 text-sm text-slate-300">{labels.map((label) => <p key={label[0]}><span className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${label[1]}`} />{label[0]}</p>)}</div>
    </div>
  );
}

function calendarDays(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const offset = (first.getDay() + 6) % 7;
  return [...Array(offset).fill(''), ...Array.from({ length: last.getDate() }, (_, index) => index + 1)];
}

export default function Reports() {
  const [period, setPeriod] = useState('this_week');
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [exportOpen, setExportOpen] = useState(false);
  const today = new Date();
  const days = calendarDays(today);
  const monthLabel = today.toLocaleDateString('es-EC', { month: 'long', year: 'numeric' });
  const periodLabels = {
    today: 'Hoy',
    this_week: 'Esta semana',
    this_month: 'Este mes',
    all: 'Todo'
  };

  useEffect(() => {
    getReportSummary(period).then((data) => {
      setSummary(data);
      setError('');
    }).catch(() => setError('No se pudo cargar el reporte.'));
  }, [period]);

  const kpis = useMemo(() => [
    ['Tareas completadas', summary?.completed_tasks ?? 0, 'desde SQLite', 'from-blue-500 to-blue-700', Check],
    ['Productividad promedio', `${summary?.productivity_average ?? 0}%`, 'equipo activo', 'from-violet-500 to-purple-800', BarChart3],
    ['Tareas totales', summary?.total_tasks ?? 0, 'periodo seleccionado', 'from-sky-500 to-blue-900', Clock3],
    ['Proyectos en progreso', summary?.active_projects ?? 0, 'proyectos activos', 'from-teal-500 to-cyan-900', Folder],
    ['Tasa de finalizacion', `${summary?.completion_rate ?? 0}%`, 'completadas / total', 'from-slate-700 to-slate-900', Target]
  ], [summary]);

  function exportCsv() {
    if (!summary) return;
    const rows = [
      ['Reporte de rendimiento TaskFlow'],
      ['Fecha de generacion', new Date().toLocaleString('es-EC')],
      ['Periodo', periodLabels[period]],
      [],
      ['Indicador', 'Valor'],
      ['total_tasks', summary.total_tasks],
      ['completed_tasks', summary.completed_tasks],
      ['pending_tasks', summary.pending_tasks],
      ['in_progress_tasks', summary.in_progress_tasks],
      ['total_projects', summary.total_projects],
      ['active_projects', summary.active_projects],
      ['completed_projects', summary.completed_projects],
      ['total_users', summary.total_users],
      ['completion_rate', summary.completion_rate],
      ['productivity_average', summary.productivity_average],
      [],
      ['Carga de trabajo por usuario'],
      ['Nombre', 'Rol', 'Carga', 'Productividad', 'Tareas asignadas'],
      ...(summary.workload_by_user ?? []).map((user) => [user.name, user.role, `${user.workload || 0}%`, `${user.productivity || 0}%`, user.assigned_tasks || 0]),
      [],
      ['Proximos vencimientos'],
      ['Titulo', 'Fecha', 'Tipo'],
      ...(summary.upcoming_deadlines ?? []).map((item) => [item.title, item.due_date, item.type])
    ];
    const blob = new Blob([rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'taskflow_reporte.csv';
    link.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  }

  function exportPdf() {
    if (!summary) return;

    const printWindow = window.open('', '_blank', 'width=1024,height=768');
    if (!printWindow) return;

    const rows = (summary.workload_by_user ?? [])
      .map((user) => `<tr><td>${user.name}</td><td>${user.role}</td><td>${user.workload || 0}%</td><td>${user.productivity || 0}%</td><td>${user.assigned_tasks || 0}</td></tr>`)
      .join('');
    const deadlines = (summary.upcoming_deadlines ?? [])
      .map((item) => `<tr><td>${item.title}</td><td>${item.due_date}</td><td>${item.type === 'project' ? 'Proyecto' : 'Tarea'}</td></tr>`)
      .join('');
    const statusRows = (summary.tasks_by_status ?? [])
      .map((item) => `<tr><td>${item.status}</td><td>${item.count}</td></tr>`)
      .join('');
    const priorityRows = (summary.tasks_by_priority ?? [])
      .map((item) => `<tr><td>${item.priority}</td><td>${item.count}</td></tr>`)
      .join('');

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Reporte de rendimiento TaskFlow</title>
          <style>
            body { margin: 0; padding: 40px; font-family: Inter, Arial, sans-serif; color: #0f172a; background: #f8fafc; }
            .cover { padding: 28px; border-radius: 22px; color: white; background: linear-gradient(135deg, #2563eb, #7c3aed, #14b8a6); }
            h1 { margin: 0; font-size: 34px; }
            h2 { margin-top: 28px; color: #1e293b; }
            .muted { color: #64748b; }
            .grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-top: 22px; }
            .kpi { background: white; border: 1px solid #e2e8f0; border-radius: 18px; padding: 16px; box-shadow: 0 12px 30px rgba(15,23,42,.08); }
            .kpi strong { display: block; margin-top: 8px; font-size: 28px; color: #2563eb; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; overflow: hidden; border-radius: 14px; background: white; }
            th, td { border: 1px solid #e2e8f0; padding: 10px 12px; text-align: left; font-size: 13px; }
            th { background: #eff6ff; color: #1e40af; }
            .two { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
            .conclusion { margin-top: 28px; padding: 18px; border-left: 5px solid #2563eb; background: white; border-radius: 16px; }
            @media print { body { background: white; padding: 20px; } .kpi { box-shadow: none; } }
          </style>
        </head>
        <body>
          <section class="cover">
            <h1>Reporte de rendimiento TaskFlow</h1>
            <p>Fecha de generacion: ${new Date().toLocaleString('es-EC')}</p>
            <p>Periodo seleccionado: ${periodLabels[period]}</p>
          </section>
          <section class="grid">
            <div class="kpi">Tareas completadas<strong>${summary.completed_tasks}</strong></div>
            <div class="kpi">Productividad promedio<strong>${summary.productivity_average}%</strong></div>
            <div class="kpi">Tareas totales<strong>${summary.total_tasks}</strong></div>
            <div class="kpi">Proyectos en progreso<strong>${summary.active_projects}</strong></div>
            <div class="kpi">Tasa de finalizacion<strong>${summary.completion_rate}%</strong></div>
          </section>
          <section class="two">
            <div><h2>Resumen de tareas por estado</h2><table><thead><tr><th>Estado</th><th>Cantidad</th></tr></thead><tbody>${statusRows || '<tr><td colspan="2">Sin datos</td></tr>'}</tbody></table></div>
            <div><h2>Resumen por prioridad</h2><table><thead><tr><th>Prioridad</th><th>Cantidad</th></tr></thead><tbody>${priorityRows || '<tr><td colspan="2">Sin datos</td></tr>'}</tbody></table></div>
          </section>
          <h2>Proximos vencimientos</h2>
          <table><thead><tr><th>Titulo</th><th>Fecha</th><th>Tipo</th></tr></thead><tbody>${deadlines || '<tr><td colspan="3">Sin vencimientos registrados</td></tr>'}</tbody></table>
          <h2>Carga de trabajo por usuario</h2>
          <table><thead><tr><th>Usuario</th><th>Rol</th><th>Carga</th><th>Productividad</th><th>Tareas</th></tr></thead><tbody>${rows || '<tr><td colspan="5">Sin usuarios registrados</td></tr>'}</tbody></table>
          <div class="conclusion">
            <strong>Conclusion:</strong>
            El equipo presenta una tasa de finalizacion de ${summary.completion_rate}% y productividad promedio de ${summary.productivity_average}%. Se recomienda revisar los vencimientos proximos y balancear la carga de trabajo si supera el 80%.
          </div>
          <script>window.onload = () => { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
    setExportOpen(false);
  }

  const bars = [summary?.pending_tasks ?? 0, summary?.in_progress_tasks ?? 0, summary?.completed_tasks ?? 0, summary?.total_projects ?? 0, summary?.total_users ?? 0];
  const maxBar = Math.max(1, ...bars);

  return (
    <div className="grid gap-5">
      <div className="flex justify-end gap-3">
        <label className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/65 px-4 py-2.5 text-sm font-bold text-slate-200">
          <select className="bg-transparent outline-none" value={period} onChange={(event) => setPeriod(event.target.value)}>
            <option className="bg-slate-900" value="today">Hoy</option>
            <option className="bg-slate-900" value="this_week">Esta semana</option>
            <option className="bg-slate-900" value="this_month">Este mes</option>
            <option className="bg-slate-900" value="all">Todo</option>
          </select>
          <ChevronDown size={16} />
        </label>
        <div className="relative">
          <button onClick={() => setExportOpen((value) => !value)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/65 px-4 py-2.5 text-sm font-bold text-slate-200"><Download size={16} /> Exportar</button>
          {exportOpen && (
            <div className="absolute right-0 top-12 z-40 w-44 rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-black/40">
              <button onClick={exportPdf} className="w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-200 hover:bg-white/10">Exportar PDF</button>
              <button onClick={exportCsv} className="w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-200 hover:bg-white/10">Exportar CSV</button>
            </div>
          )}
        </div>
      </div>
      {error && <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">{kpis.map(([label, value, helper, color, Icon]) => <KpiCard key={label} label={label} value={value} helper={helper} color={color} Icon={Icon} />)}</section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr_280px]">
        <Panel>
          <h3 className="mb-5 font-black text-white">Tendencia de productividad</h3>
          <div className="relative h-52 rounded-xl bg-slate-950/25 p-4">
            <svg className="absolute inset-x-8 bottom-9 top-8 h-[145px] w-[calc(100%-4rem)] overflow-visible" viewBox="0 0 500 145" preserveAspectRatio="none">
              <polyline fill="none" stroke="#3B82F6" strokeWidth="4" points={`0,${145 - (summary?.completion_rate ?? 0)} 125,80 250,${145 - (summary?.productivity_average ?? 0)} 375,60 500,${145 - (summary?.completion_rate ?? 0)}`} />
              <polyline fill="none" stroke="#60A5FA" strokeDasharray="8 8" strokeWidth="2" points="0,75 500,75" />
            </svg>
          </div>
        </Panel>
        <Panel>
          <h3 className="mb-5 font-black text-white">Resumen por categoria</h3>
          <div className="flex h-52 items-end gap-4 rounded-xl bg-slate-950/25 p-4">
            {bars.map((value, index) => <div key={index} className="flex flex-1 flex-col items-center gap-3"><div className="w-full rounded-t-xl bg-gradient-to-t from-violet-600 to-blue-400" style={{ height: `${Math.max(8, (value / maxBar) * 100)}%` }} /><span className="text-xs text-slate-500">{['Pen', 'Prog', 'Comp', 'Proy', 'Users'][index]}</span></div>)}
          </div>
        </Panel>
        <Panel className="row-span-2">
          <h3 className="mb-4 font-black capitalize text-white">{monthLabel}</h3>
          <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-400">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day) => <span key={day} className="font-bold text-slate-300">{day}</span>)}
            {days.map((day, index) => <span key={`${day}-${index}`} className={`rounded-lg py-2 ${day === today.getDate() ? 'bg-blue-600 text-white' : ''}`}>{day}</span>)}
          </div>
          <h3 className="mb-4 mt-6 font-black text-white">Proximos hitos</h3>
          {(summary?.upcoming_deadlines ?? []).map((item) => <div key={`${item.title}-${item.due_date}`} className="mb-3 flex items-center justify-between rounded-xl bg-white/[0.04] p-3"><p className="text-xs font-semibold text-slate-200">{item.title}</p><span className="rounded-lg bg-blue-500/15 px-2 py-1 text-xs font-bold text-blue-300">{item.due_date}</span></div>)}
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_0.85fr_0.9fr]">
        <Panel><h3 className="mb-5 font-black text-white">Carga de trabajo por miembro</h3><div className="grid gap-4">{(summary?.workload_by_user ?? []).map((member) => <div key={member.name} className="grid grid-cols-[1fr_auto] items-center gap-3"><div><p className="text-sm font-bold text-white">{member.name}</p><p className="text-xs text-slate-500">{member.role}</p></div><span className="text-sm font-bold text-slate-300">{member.workload || 0}%</span><div className="col-span-2 h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-violet-500" style={{ width: `${member.workload || 0}%` }} /></div></div>)}</div></Panel>
        <Panel>
          <h3 className="mb-5 font-black text-white">Estado de tareas</h3>
          <Donut
            center={summary?.total_tasks ?? 0}
            labels={[
              [`Completadas ${summary?.completed_tasks ?? 0}`, 'bg-teal-400'],
              [`En progreso ${summary?.in_progress_tasks ?? 0}`, 'bg-blue-400'],
              [`Pendientes ${summary?.pending_tasks ?? 0}`, 'bg-violet-400']
            ]}
          />
        </Panel>
        <Panel><h3 className="mb-4 font-black text-white">Insights destacados</h3>{[`La tasa de finalizacion es ${summary?.completion_rate ?? 0}%.`, `Productividad promedio: ${summary?.productivity_average ?? 0}%.`, `Usuarios registrados: ${summary?.total_users ?? 0}.`, `Proyectos activos: ${summary?.active_projects ?? 0}.`].map((item) => <p key={item} className="border-b border-white/10 py-3 text-xs leading-5 text-slate-300 last:border-0">{item}</p>)}</Panel>
      </section>
    </div>
  );
}
