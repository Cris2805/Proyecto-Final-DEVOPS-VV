import { X } from 'lucide-react';

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl'
};

export default function Modal({
  open = false,
  onClose,
  title,
  children,
  footer = null,
  size = 'lg'
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 py-6 backdrop-blur-md">
      <section
        className={`max-h-[92vh] w-full ${sizes[size] ?? sizes.lg} overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/50 ring-1 ring-blue-400/10`}
      >
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="text-xl font-black text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </header>

        <div className="max-h-[calc(92vh-9rem)] overflow-y-auto px-6 py-5">
          {children}
        </div>

        {footer && (
          <footer className="border-t border-white/10 px-6 py-4">
            {footer}
          </footer>
        )}
      </section>
    </div>
  );
}
