import { expect, test } from '@playwright/test';
import { createTaskFromModal, deleteTaskByTitle, goToTasks } from './helpers/auth.js';

test('Gestion de tareas permite editar una tarea usando el icono Editar', async ({ page }) => {
  const originalTitle = `Editar E2E ${Date.now()}`;
  const updatedTitle = `${originalTitle} actualizada`;

  await goToTasks(page);
  await createTaskFromModal(page, originalTitle, {
    description: 'Descripcion inicial'
  });

  const row = page.locator('tr').filter({ hasText: originalTitle });
  await expect(row).toBeVisible();
  await row.getByTitle('Editar tarea').click();

  await expect(page.getByRole('heading', { name: /editar tarea/i })).toBeVisible();
  await page.getByLabel(/t[ií]tulo de la tarea|titulo de la tarea/i).fill(updatedTitle);
  await page.getByLabel(/descripci[oó]n|descripcion/i).fill('Descripcion actualizada desde Playwright');
  await page.getByRole('button', { name: /actualizar/i }).click();

  await expect(page.locator('tr').filter({ hasText: updatedTitle })).toBeVisible();
  await deleteTaskByTitle(page, updatedTitle);
});
