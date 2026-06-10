const variants = {
  primary:
    'bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400 text-white shadow-lg shadow-blue-950/40 hover:brightness-110',
  secondary:
    'border border-slate-700 bg-slate-900/80 text-slate-100 hover:border-blue-400/60 hover:bg-slate-800',
  ghost: 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
};

export default function Button({ children, type = 'button', variant = 'primary', className = '', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
