import { expect, test } from '@playwright/test';
import { createTaskFromModal, deleteTaskByTitle, goToTasks, login } from './helpers/auth.js';

test('Login carga correctamente', async ({ page }) => {
  await page.goto('/login');

  await expect(page.getByRole('heading', { name: /bienvenido de nuevo/i })).toBeVisible();
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.getByRole('button', { name: /iniciar sesi[oó]n/i })).toBeVisible();
});

test('Login real navega al Dashboard', async ({ page }) => {
  await login(page);

  await expect(page.getByRole('heading', { name: /panel de tareas/i })).toBeVisible();
});

test('Gestion de tareas permite crear una tarea desde modal', async ({ page }) => {
  const taskTitle = `Tarea E2E ${Date.now()}`;

  await goToTasks(page);
  const createdRow = await createTaskFromModal(page, taskTitle, {
    dueDate: '2026-07-10',
    status: 'pendiente',
    priority: 'alta',
    responsible: 'QA E2E',
    project: 'TaskFlow V&V',
    tags: 'e2e,playwright'
  });

  await expect(createdRow).toBeVisible();
  await expect(createdRow.getByText(/pendiente/i)).toBeVisible();
  await expect(createdRow.locator('select')).toHaveCount(0);

  await deleteTaskByTitle(page, taskTitle);
});
