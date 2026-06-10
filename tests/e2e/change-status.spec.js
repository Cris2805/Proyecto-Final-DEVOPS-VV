import { expect, test } from '@playwright/test';

test('Gestion de tareas permite cambiar estado a completada', async ({ page }) => {
  const taskTitle = `Estado E2E ${Date.now()}`;

  await page.goto('/tasks');
  await page.getByRole('button', { name: /Nueva tarea/i }).click();
  await page.getByLabel(/Titulo de la tarea/i).fill(taskTitle);
  await page.getByLabel(/Estado/i).selectOption('pendiente');
  await page.getByRole('button', { name: /Guardar/i }).click();

  const row = page.locator('tr').filter({ hasText: taskTitle });
  await expect(row).toBeVisible();
  await row.locator('select').selectOption('completada');
  await expect(row.locator('select')).toHaveValue('completada');

  page.once('dialog', (dialog) => dialog.accept());
  await row.getByTitle('Eliminar tarea').click();
});
