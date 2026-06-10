import {
  BarChart3,
  ChevronDown,
  ClipboardList,
  FolderKanban,
  Home,
  Settings,
  Users
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../../services/apiService.js';

const menuItems = [
  { label: 'Inicio', path: '/', icon: Home },
  { label: 'Tareas', path: '/tasks', icon: ClipboardList },
  { label: 'Proyectos', path: '/projects', icon: FolderKanban },
  { label: 'Equipo', path: '/team', icon: Users },
  { label: 'Reportes', path: '/reports', icon: BarChart3 },
  { label: 'Ajustes', path: '/settings', icon: Settings }
];

function TaskFlowMark() {
  return (
    <div className="relative h-11 w-11 shrink-0">
      <span className="absolute left-0 top-2 h-2.5 w-10 rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-500 shadow-lg shadow-blue-500/40" />
      <span className="absolute left-4 top-3 h-7 w-8 rounded-r-2xl rounded-tl-md bg-gradient-to-br from-blue-400 to-violet-600" />
      <span className="absolute left-4 top-3 h-10 w-2.5 rounded-full bg-gradient-to-b from-violet-400 to-blue-500" />
    </div>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const user = getCurrentUser();
  const initials = user?.avatar_initials || user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'CM';

  return (
    <aside className="tf-sidebar hidden h-screen w-[260px] shrink-0 border-r border-white/10 bg-slate-950/75 px-4 py-5 shadow-2xl shadow-black/30 backdrop-blur-2xl lg:sticky lg:top-0 lg:flex lg:flex-col">
      <div className="flex items-center gap-3 px-2">
        <TaskFlowMark />
        <div>
          <h2 className="text-xl font-black tracking-tight text-white">TaskFlow</h2>
          <p className="text-xs font-medium text-slate-500">Premium workspace</p>
        </div>
      </div>

      <nav className="mt-8 grid gap-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-bold transition duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500/25 via-violet-500/20 to-cyan-400/15 text-white shadow-lg shadow-blue-950/30 ring-1 ring-blue-400/30'
                  : 'text-slate-400 hover:bg-white/[0.055] hover:text-slate-100'
              }`}
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-xl transition ${
                  isActive ? 'bg-white/10 text-cyan-200' : 'bg-slate-900/70 text-slate-500 group-hover:text-blue-300'
                }`}
              >
                <Icon size={18} />
              </span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto grid gap-3">
        <button className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-left transition hover:border-violet-400/35">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-slate-100 to-slate-500 text-sm font-black text-slate-950">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{user?.name || 'Carlos Mendoza'}</p>
            <p className="text-xs text-slate-500">{user?.role || 'Administrador'}</p>
          </div>
          <ChevronDown size={16} className="text-slate-500" />
        </button>
      </div>
    </aside>
  );
}
