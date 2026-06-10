import { expect, test } from '@playwright/test';

test('Gestion de tareas permite editar una tarea existente', async ({ page }) => {
  const originalTitle = `Editar E2E ${Date.now()}`;
  const updatedTitle = `${originalTitle} actualizada`;

  await page.goto('/tasks');
  await page.getByRole('button', { name: /Nueva tarea/i }).click();
  await page.getByLabel(/Titulo de la tarea/i).fill(originalTitle);
  await page.getByLabel(/Descripcion/i).fill('Descripcion inicial');
  await page.getByRole('button', { name: /Guardar/i }).click();

  const row = page.locator('tr').filter({ hasText: originalTitle });
  await expect(row).toBeVisible();
  await row.click();

  await expect(page.getByRole('heading', { name: /Editar tarea/i })).toBeVisible();
  await page.getByLabel(/Titulo de la tarea/i).fill(updatedTitle);
  await page.getByLabel(/Descripcion/i).fill('Descripcion actualizada desde Playwright');
  await page.getByRole('button', { name: /Actualizar/i }).click();

  await expect(page.locator('tr').filter({ hasText: updatedTitle })).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('tr').filter({ hasText: updatedTitle }).getByTitle('Eliminar tarea').click();
});
