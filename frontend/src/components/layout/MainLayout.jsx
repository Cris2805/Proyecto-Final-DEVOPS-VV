import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';

export default function MainLayout({ children }) {
  return (
    <div className="tf-app-shell min-h-screen bg-[#020617] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(59,130,246,0.18),transparent_24rem),radial-gradient(circle_at_90%_18%,rgba(20,184,166,0.12),transparent_22rem),radial-gradient(circle_at_50%_100%,rgba(139,92,246,0.16),transparent_28rem)]" />
      <div className="pointer-events-none fixed inset-0 opacity-35 [background-image:linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] [background-size:86px_86px]" />

      <div className="relative z-10 lg:flex">
        <Sidebar />
        <div className="min-w-0 flex-1 p-3 lg:p-4">
          <div className="tf-main-panel min-h-[calc(100vh-2rem)] overflow-hidden rounded-3xl border border-white/10 bg-slate-900/35 shadow-2xl shadow-black/30 backdrop-blur-2xl">
            <Header />
            <main className="mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-8">
              {children ?? <Outlet />}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
