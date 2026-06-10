const variants = {
  default: 'border-slate-700 bg-slate-800/80 text-slate-200',
  pending: 'border-amber-400/30 bg-amber-500/10 text-amber-300',
  progress: 'border-blue-400/30 bg-blue-500/10 text-blue-300',
  completed: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
  high: 'border-red-400/30 bg-red-500/10 text-red-300',
  medium: 'border-orange-400/30 bg-orange-500/10 text-orange-300',
  low: 'border-teal-400/30 bg-teal-500/10 text-teal-300'
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
