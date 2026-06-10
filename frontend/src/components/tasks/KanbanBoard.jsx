export default function KanbanBoard() {
  const columns = ['pendiente', 'en progreso', 'completada'];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {columns.map((column) => (
        <section key={column} className="rounded border border-slate-200 bg-white p-4">
          <h3 className="font-semibold capitalize">{column}</h3>
        </section>
      ))}
    </div>
  );
}
