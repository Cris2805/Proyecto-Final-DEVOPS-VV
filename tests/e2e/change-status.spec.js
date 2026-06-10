import { expect, test } from '@playwright/test';
import { createTaskFromModal, deleteTaskByTitle, goToTasks } from './helpers/auth.js';

test('Gestion de tareas permite cambiar estado desde el modal', async ({ page }) => {
  const taskTitle = `Estado E2E ${Date.now()}`;

  await goToTasks(page);
  await createTaskFromModal(page, taskTitle, {
    status: 'pendiente'
  });

  const row = page.locator('tr').filter({ hasText: taskTitle });
  await expect(row).toBeVisible();
  await row.getByTitle('Editar tarea').click();

  await expect(page.getByRole('heading', { name: /editar tarea/i })).toBeVisible();
  await page.getByLabel(/estado/i).last().selectOption('completada');
  await page.getByRole('button', { name: /actualizar/i }).click();

  const updatedRow = page.locator('tr').filter({ hasText: taskTitle });
  await expect(updatedRow.getByText(/completada/i)).toBeVisible();

  await deleteTaskByTitle(page, taskTitle);
});
