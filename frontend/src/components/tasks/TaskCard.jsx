import Badge from '../ui/Badge.jsx';
import Card from '../ui/Card.jsx';

const statusVariant = {
  pendiente: 'pending',
  'en progreso': 'progress',
  completado: 'completed'
};

export default function TaskCard({ task }) {
  return (
    <Card className="transition hover:border-blue-400/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">{task?.title ?? 'Nueva tarea'}</h3>
          <p className="mt-2 text-sm text-slate-400">{task?.project ?? 'TaskFlow'}</p>
        </div>
        <Badge variant={statusVariant[task?.status] ?? 'default'}>
          {task?.status ?? 'pendiente'}
        </Badge>
      </div>
    </Card>
  );
}
