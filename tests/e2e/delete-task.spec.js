import { expect, test } from '@playwright/test';
import { createTaskFromModal, deleteTaskByTitle, goToTasks } from './helpers/auth.js';

test('Gestion de tareas permite eliminar una tarea con confirmacion', async ({ page }) => {
  const taskTitle = `Eliminar E2E ${Date.now()}`;

  await goToTasks(page);
  await createTaskFromModal(page, taskTitle, { description: false });

  const row = page.locator('tr').filter({ hasText: taskTitle });
  await expect(row).toBeVisible();

  await deleteTaskByTitle(page, taskTitle);
});
