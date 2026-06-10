export async function login(page) {
  await page.goto('/login');
  await page.locator('input[type="email"]').fill('carlos@taskflow.com');
  await page.locator('input[type="password"]').fill('123456');
  await page.getByRole('button', { name: /iniciar sesi[oó]n/i }).click();
  await page.waitForURL((url) => url.pathname === '/');
}

export async function goToTasks(page) {
  await login(page);
  await page.goto('/tasks');
  await page.getByRole('heading', { name: /gesti[oó]n de tareas|gestion de tareas/i }).waitFor();
}

export async function createTaskFromModal(page, taskTitle, overrides = {}) {
  await page.getByRole('button', { name: /nueva tarea/i }).click();
  await page.getByRole('heading', { name: /nueva tarea/i }).waitFor();
  await page.getByLabel(/t[ií]tulo de la tarea|titulo de la tarea/i).fill(taskTitle);

  if (overrides.description !== false) {
    await page
      .getByLabel(/descripci[oó]n|descripcion/i)
      .fill(overrides.description ?? 'Tarea creada desde Playwright para evidencia E2E.');
  }

  if (overrides.dueDate) {
    await page.locator('input[type="date"]').last().fill(overrides.dueDate);
  }

  if (overrides.status) {
    await page.getByLabel(/estado/i).last().selectOption(overrides.status);
  }

  if (overrides.priority) {
    await page.getByLabel(/prioridad/i).last().selectOption(overrides.priority);
  }

  if (overrides.responsible) {
    await page.getByLabel(/responsable/i).fill(overrides.responsible);
  }

  if (overrides.project) {
    await page.getByLabel(/proyecto/i).fill(overrides.project);
  }

  if (overrides.tags) {
    await page.getByLabel(/etiquetas/i).fill(overrides.tags);
  }

  await page.getByRole('button', { name: /guardar/i }).click();

  const row = page.locator('tr').filter({ hasText: taskTitle });
  await row.waitFor();
  return row;
}

export async function deleteTaskByTitle(page, taskTitle) {
  const row = page.locator('tr').filter({ hasText: taskTitle });
  await row.waitFor();

  page.once('dialog', async (dialog) => {
    await dialog.accept();
  });

  await row.getByTitle('Eliminar tarea').click();
  await row.waitFor({ state: 'detached' });
}
