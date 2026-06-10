import { expect, test } from '@playwright/test';

test('Gestion de tareas permite eliminar una tarea con confirmacion', async ({ page }) => {
  const taskTitle = `Eliminar E2E ${Date.now()}`;

  await page.goto('/tasks');
  await page.getByRole('button', { name: /Nueva tarea/i }).click();
  await page.getByLabel(/Titulo de la tarea/i).fill(taskTitle);
  await page.getByRole('button', { name: /Guardar/i }).click();

  const row = page.locator('tr').filter({ hasText: taskTitle });
  await expect(row).toBeVisible();

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain(taskTitle);
    await dialog.accept();
  });
  await row.getByTitle('Eliminar tarea').click();

  await expect(row).toHaveCount(0);
});
