import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  CheckCircle2,
  EyeOff,
  Lock,
  Mail,
  Quote,
  TrendingUp,
  UsersRound
} from 'lucide-react';
import { loginUser } from '../services/authService.js';

function TaskFlowLogo({ large = false }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`${large ? 'h-14 w-14' : 'h-12 w-12'} relative shrink-0`}>
        <span className={`${large ? 'w-14' : 'w-12'} absolute left-0 top-2 h-3 rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-500 shadow-lg shadow-blue-500/40`} />
        <span className={`${large ? 'h-8 w-9' : 'h-8 w-9'} absolute left-5 top-4 rounded-r-2xl rounded-tl-md bg-gradient-to-br from-blue-400 to-violet-600`} />
        <span className={`${large ? 'h-10' : 'h-11'} absolute left-5 top-4 w-3 rounded-full bg-gradient-to-b from-violet-400 to-blue-500`} />
      </div>
      <span className={`${large ? 'text-3xl' : 'text-2xl'} font-black tracking-tight text-slate-50`}>
        TaskFlow
      </span>
    </div>
  );
}

function FloatingStat({ title, value, helper, icon: Icon, className, tone }) {
  return (
    <article
      className={`absolute rounded-3xl border border-slate-300/15 bg-slate-900/60 p-4 shadow-2xl shadow-black/35 backdrop-blur-2xl xl:p-5 ${className}`}
    >
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-sm font-semibold text-slate-100">{title}</p>
          <p className="mt-1 text-3xl font-black tracking-tight text-white xl:text-4xl">{value}</p>
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-2xl ${tone}`}>
          <Icon size={22} />
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-300">{helper}</p>
    </article>
  );
}

function TaskPreview({ title, tag, date, className }) {
  return (
    <article
      className={`absolute rounded-3xl border border-slate-300/15 bg-slate-900/70 p-4 shadow-2xl shadow-black/40 backdrop-blur-2xl xl:p-5 ${className}`}
    >
      <div className="flex gap-3">
        <span className="mt-1.5 h-3 w-3 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50" />
        <div>
          <h3 className="max-w-64 text-base font-bold leading-6 text-white">{title}</h3>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-bold text-blue-300">
              {tag}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <CalendarDays size={14} />
              {date}
            </span>
            <span className="rounded-full border border-red-400/35 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-300">
              Alta
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function ProductivityCard() {
  return (
    <article className="absolute left-[410px] top-[485px] w-[238px] rounded-3xl border border-slate-300/15 bg-slate-900/70 p-4 shadow-2xl shadow-black/40 backdrop-blur-2xl xl:left-[455px] xl:top-[505px] xl:w-[260px]">
      <p className="text-sm font-bold text-white">Productividad del equipo</p>
      <div className="mt-4 flex items-center gap-3 xl:gap-4">
        <div className="grid h-[86px] w-[86px] shrink-0 place-items-center rounded-full bg-[conic-gradient(#14B8A6_0_42%,#3B82F6_42%_76%,#8B5CF6_76%_100%)] p-2.5 shadow-lg shadow-teal-950/30 xl:h-24 xl:w-24">
          <div className="grid h-full w-full place-items-center rounded-full bg-[#081225] text-center">
            <div>
              <p className="text-xl font-black text-white xl:text-2xl">78%</p>
              <p className="text-xs text-slate-400">Productividad</p>
            </div>
          </div>
        </div>
        <div className="grid gap-2 text-xs text-slate-300">
          <p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-teal-400" />Completadas 50</p>
          <p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-400" />En progreso 36</p>
          <p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-violet-400" />Pendientes 42</p>
        </div>
      </div>
    </article>
  );
}

function DecorativeIcon({ children, className }) {
  return (
    <div className={`absolute grid h-14 w-14 place-items-center rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError('');
      const user = await loginUser({ email, password });
      localStorage.setItem('taskflow_user', JSON.stringify(user));
      navigate('/');
    } catch (loginError) {
      setError(loginError.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,rgba(139,92,246,0.33),transparent_23rem),radial-gradient(circle_at_25%_18%,rgba(59,130,246,0.23),transparent_30rem),radial-gradient(circle_at_88%_12%,rgba(20,184,166,0.16),transparent_24rem),linear-gradient(135deg,#020617_0%,#07142b_48%,#0B1120_100%)]" />
      <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] [background-size:86px_86px]" />
      <div className="absolute left-8 top-[32%] hidden h-[32rem] w-[32rem] rounded-full border border-dashed border-violet-500/25 lg:block" />
      <div className="absolute left-36 top-[42%] hidden h-[30rem] w-[30rem] rounded-full border border-dashed border-blue-500/20 lg:block" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1500px] items-center gap-8 px-5 py-6 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 xl:px-10">
        <section className="relative hidden h-[805px] -translate-x-4 overflow-visible lg:block xl:h-[835px] xl:-translate-x-5">
          <TaskFlowLogo />

          <div className="mt-10 max-w-2xl xl:mt-12">
            <h1 className="text-[2.9rem] font-black leading-[1.05] tracking-tight text-white xl:text-[3.35rem]">
              Organiza. Colabora.
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                Impulsa resultados.
              </span>
            </h1>
            <p className="mt-5 max-w-[500px] text-base leading-7 text-slate-300">
              La plataforma todo en uno para gestionar tareas, proyectos y equipos de manera simple y efectiva.
            </p>
          </div>

          <FloatingStat
            title="En progreso"
            value="36"
            helper="+15% vs. la semana pasada"
            icon={TrendingUp}
            tone="bg-blue-500/20 text-blue-100"
            className="left-[34px] top-[295px] w-[238px] -rotate-8 bg-blue-500/15 xl:left-[52px] xl:top-[310px] xl:w-[260px]"
          />

          <FloatingStat
            title="Completadas"
            value="50"
            helper="+20% vs. la semana pasada"
            icon={CheckCircle2}
            tone="bg-teal-500/20 text-teal-100"
            className="left-[365px] top-[305px] w-[238px] rotate-2 bg-teal-500/15 xl:left-[405px] xl:top-[318px] xl:w-[260px]"
          />

          <TaskPreview
            title={'Dise\u00f1ar nuevas pantallas de onboarding'}
            tag={'Dise\u00f1o'}
            date="28 may"
            className="left-[64px] top-[435px] w-[282px] -rotate-6 xl:left-[82px] xl:top-[455px] xl:w-[300px]"
          />

          <TaskPreview
            title={'Integraci\u00f3n con pasarela de pagos'}
            tag="Desarrollo"
            date="26 may"
            className="left-[84px] top-[575px] w-[282px] -rotate-5 xl:left-[102px] xl:top-[605px] xl:w-[300px]"
          />

          <ProductivityCard />

          <DecorativeIcon className="left-[0px] top-[610px] bg-blue-500/70 text-white shadow-blue-500/30 xl:top-[650px]">
            <TrendingUp size={24} />
          </DecorativeIcon>
          <DecorativeIcon className="left-[0px] top-[490px] bg-violet-500/70 text-white shadow-violet-500/30 xl:top-[520px]">
            <UsersRound size={24} />
          </DecorativeIcon>
          <DecorativeIcon className="left-[520px] top-[655px] bg-teal-500/70 text-white shadow-teal-500/30 xl:left-[565px] xl:top-[690px]">
            <CheckCircle2 size={25} />
          </DecorativeIcon>

          <article className="absolute left-[92px] top-[735px] w-[405px] rounded-[2rem] border border-slate-300/15 bg-slate-900/45 p-4 shadow-2xl shadow-black/35 backdrop-blur-2xl xl:left-[106px] xl:top-[765px] xl:w-[440px]">
            <Quote className="text-slate-400" size={30} />
            <p className="ml-11 -mt-6 max-w-md text-sm leading-6 text-slate-300">
              TaskFlow nos ha ayudado a centralizar todo el trabajo de nuestro equipo y aumentar nuestra productividad.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-slate-100 to-slate-500 text-sm font-black text-slate-950">
                CM
              </div>
              <div>
                <p className="text-sm font-bold text-white">Carlos Mendoza</p>
                <p className="text-xs text-slate-400">Director de Operaciones</p>
              </div>
            </div>
          </article>
        </section>

        <section className="grid min-h-screen place-items-center py-4 lg:min-h-0">
          <form
            className="w-full max-w-[43rem] rounded-[2rem] border border-slate-300/15 bg-slate-900/55 p-7 shadow-2xl shadow-black/45 backdrop-blur-2xl sm:p-9 xl:p-12"
            onSubmit={handleLogin}
          >
            <div className="flex justify-center">
              <TaskFlowLogo large />
            </div>

            <div className="mt-9">
              <h2 className="text-4xl font-black tracking-tight text-white xl:text-[2.75rem]">
                Bienvenido de nuevo {'\uD83D\uDC4B'}
              </h2>
              <p className="mt-3 max-w-lg text-base leading-7 text-slate-400 xl:text-lg xl:leading-8">
                Inicia sesi&oacute;n para continuar gestionando tu trabajo y el de tu equipo.
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-200">
                {error}
              </div>
            )}

            <div className="mt-8 grid gap-5">
              <label className="grid gap-3 text-base font-semibold text-slate-300">
                Correo electr&oacute;nico
                <span className="flex items-center gap-4 rounded-2xl border border-slate-300/15 bg-slate-950/35 px-5 py-4 text-slate-400 shadow-inner shadow-black/10 transition focus-within:border-blue-400/60 xl:py-5">
                  <Mail size={22} />
                  <input
                    type="email"
                    className="w-full bg-transparent text-lg text-white outline-none placeholder:text-slate-500"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </span>
              </label>

              <label className="grid gap-3 text-base font-semibold text-slate-300">
                Contrase&ntilde;a
                <span className="flex items-center gap-4 rounded-2xl border border-slate-300/15 bg-slate-950/35 px-5 py-4 text-slate-400 shadow-inner shadow-black/10 transition focus-within:border-blue-400/60 xl:py-5">
                  <Lock size={22} />
                  <input
                    type="password"
                    className="w-full bg-transparent text-lg text-white outline-none placeholder:text-slate-500"
                    placeholder="**************"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button type="button" className="text-slate-400 transition hover:text-blue-300">
                    <EyeOff size={22} />
                  </button>
                </span>
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-4 text-base sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-3 text-slate-300">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5 rounded-md border-slate-400/30 bg-blue-600 accent-blue-500"
                />
                Recordarme
              </label>
              <button type="button" className="text-left font-semibold text-blue-400 transition hover:text-blue-300">
                &iquest;Olvidaste tu contrase&ntilde;a?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-7 w-full rounded-2xl bg-gradient-to-r from-blue-500 via-blue-600 to-violet-600 px-6 py-4 text-lg font-black text-white shadow-2xl shadow-blue-950/50 transition duration-200 hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 xl:py-5"
            >
              {loading ? 'Validando...' : 'Iniciar sesión'}
            </button>

            <p className="mt-8 text-center text-base text-slate-400">
              &iquest;No tienes una cuenta?
              <button type="button" className="ml-2 font-bold text-blue-400 transition hover:text-blue-300">
                Crear cuenta
              </button>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
