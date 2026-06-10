import Button from '../ui/Button.jsx';

export default function TaskForm() {
  return (
    <form className="grid gap-3">
      <input className="rounded border border-slate-300 p-2" placeholder="Titulo de la tarea" />
      <Button type="submit">Guardar</Button>
    </form>
  );
}
