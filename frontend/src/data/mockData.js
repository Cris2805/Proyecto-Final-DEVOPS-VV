// Datos temporales para pruebas visuales iniciales.
export const mockTasks = [
  {
    id: 1,
    title: 'Configurar base del proyecto',
    status: 'pendiente',
    priority: 'alta',
    project: 'DevOps V&V',
    assignee: 'Cristian',
    dueDate: 'Hoy',
    progress: 35
  },
  {
    id: 2,
    title: 'Validar endpoint de salud',
    status: 'completado',
    priority: 'media',
    project: 'Backend API',
    assignee: 'QA Team',
    dueDate: 'Ayer',
    progress: 100
  },
  {
    id: 3,
    title: 'Disenar panel de tareas',
    status: 'en progreso',
    priority: 'alta',
    project: 'Frontend',
    assignee: 'UI Team',
    dueDate: 'Viernes',
    progress: 68
  },
  {
    id: 4,
    title: 'Documentar ambientes',
    status: 'pendiente',
    priority: 'baja',
    project: 'DevOps',
    assignee: 'Cristian',
    dueDate: 'Lunes',
    progress: 20
  },
  {
    id: 5,
    title: 'Preparar casos de prueba E2E',
    status: 'en progreso',
    priority: 'media',
    project: 'V&V',
    assignee: 'QA Team',
    dueDate: 'Martes',
    progress: 52
  },
  {
    id: 6,
    title: 'Ajustar pipeline CI',
    status: 'completado',
    priority: 'baja',
    project: 'CI/CD',
    assignee: 'DevOps',
    dueDate: 'Hoy',
    progress: 100
  }
];

export const recentActivity = [
  { id: 1, text: 'Backend verificado desde el Dashboard', time: 'Hace 5 min', tone: 'teal' },
  { id: 2, text: 'Pipeline CI configurado para pruebas', time: 'Hace 25 min', tone: 'blue' },
  { id: 3, text: 'Se agregaron casos E2E base', time: 'Hace 1 h', tone: 'violet' },
  { id: 4, text: 'Documentacion tecnica inicial creada', time: 'Ayer', tone: 'orange' }
];

export const productivityData = [
  { label: 'Lun', value: 52 },
  { label: 'Mar', value: 68 },
  { label: 'Mie', value: 61 },
  { label: 'Jue', value: 76 },
  { label: 'Vie', value: 84 },
  { label: 'Sab', value: 45 },
  { label: 'Dom', value: 58 }
];
