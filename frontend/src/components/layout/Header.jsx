import { BarChart3, Bell, ChevronDown, ClipboardList, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/apiService.js';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead
} from '../../services/notificationService.js';

const titles = {
  '/': 'Panel de tareas 👋',
  '/tasks': 'Gestion de tareas',
  '/projects': 'Proyectos',
  '/team': 'Equipo',
  '/profile': 'Perfil',
  '/reports': 'Reportes',
  '/settings': 'Ajustes'
};

const subtitles = {
  '/': 'Aqui tienes un resumen general del trabajo de tu equipo.',
  '/tasks': 'Organiza, prioriza y da seguimiento a todas las tareas de tu equipo.',
  '/reports': 'Analiza el rendimiento de tu equipo y el progreso de los proyectos.',
  '/projects': 'Agrupa iniciativas, entregables y responsables.',
  '/team': 'Revisa miembros, roles y capacidad del equipo.',
  '/profile': 'Administra tu informacion personal.',
  '/settings': 'Administra preferencias y configuracion del workspace.'
};

const titleIcons = {
  '/tasks': ClipboardList,
  '/reports': BarChart3
};

export default function Header({ title }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const user = getCurrentUser();
  const viewTitle = title ?? titles[location.pathname] ?? 'TaskFlow';
  const subtitle = subtitles[location.pathname] ?? 'Gestion visual de productividad.';
  const TitleIcon = titleIcons[location.pathname];
  const unreadCount = useMemo(() => notifications.filter((item) => !item.is_read).length, [notifications]);

  async function loadNotifications() {
    try {
      setNotifications(await getNotifications());
    } catch {
      setNotifications([]);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function readNotification(id) {
    await markNotificationRead(id);
    await loadNotifications();
  }

  async function readAllNotifications() {
    await markAllNotificationsRead();
    await loadNotifications();
  }

  function logout() {
    localStorage.removeItem('taskflow_user');
    navigate('/login');
  }

  return (
    <header className="tf-header sticky top-0 z-30 border-b border-white/10 bg-slate-950/55 px-4 py-4 backdrop-blur-2xl sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-black tracking-tight text-white lg:text-3xl">
            {TitleIcon && <TitleIcon size={26} className="text-cyan-300" />}
            {viewTitle}
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-400">{subtitle}</p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/65 px-4 py-3 text-slate-400 shadow-inner shadow-black/10 transition focus-within:border-blue-400/50 md:w-[29rem]">
            <Search size={18} />
            <input
              className="w-full bg-transparent text-sm font-medium text-slate-100 outline-none placeholder:text-slate-500"
              placeholder="Buscar tareas, proyectos, personas..."
            />
            <span className="rounded-lg border border-white/10 bg-white/[0.06] px-2 py-1 text-xs font-bold text-slate-400">
              ⌘ K
            </span>
          </label>

          <div className="relative">
          <button
            className="relative grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-slate-900/70 text-slate-300 shadow-lg shadow-black/10 transition hover:border-blue-400/45 hover:text-white"
            onClick={() => setNotificationsOpen((value) => !value)}
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] font-black text-white ring-4 ring-slate-950">
                {unreadCount}
              </span>
            )}
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 top-14 z-50 w-80 rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-black text-white">Notificaciones</h3>
                <button className="text-xs font-bold text-blue-300" onClick={readAllNotifications}>Marcar todas</button>
              </div>
              <div className="grid max-h-80 gap-2 overflow-y-auto">
                {notifications.length === 0 && <p className="rounded-xl bg-white/[0.04] p-3 text-sm text-slate-400">Sin notificaciones</p>}
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    className={`rounded-xl p-3 text-left transition hover:bg-white/[0.06] ${notification.is_read ? 'bg-white/[0.025]' : 'bg-blue-500/10'}`}
                    onClick={() => readNotification(notification.id)}
                  >
                    <p className="text-sm font-bold text-white">{notification.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{notification.message}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          </div>

          <div className="relative">
          <button
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2.5 shadow-lg shadow-black/10 transition hover:border-violet-400/35"
            onClick={() => setUserOpen((value) => !value)}
          >
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 text-sm font-black text-white">
              {user?.avatar_initials || user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'CM'}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-bold text-white">{user?.name || 'Carlos Mendoza'}</p>
              <p className="text-xs text-slate-500">{user?.role || 'Administrador'}</p>
            </div>
            <ChevronDown size={16} className="text-slate-500" />
          </button>
          {userOpen && (
            <div className="absolute right-0 top-14 z-50 w-56 rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
              <button className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-300 hover:bg-white/[0.06]" onClick={() => navigate('/profile')}>Perfil</button>
              <button className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-300 hover:bg-white/[0.06]" onClick={() => navigate('/settings')}>Ajustes</button>
              <button className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-300 hover:bg-red-500/10" onClick={logout}>Cerrar sesion</button>
            </div>
          )}
          </div>
        </div>
      </div>
    </header>
  );
}
