export default function TaskTable({ tasks = [] }) {
  return (
    <table className="w-full border-collapse bg-white text-left">
      <thead>
        <tr>
          <th className="border-b p-3">Tarea</th>
          <th className="border-b p-3">Estado</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td className="border-b p-3">{task.title}</td>
            <td className="border-b p-3">{task.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
