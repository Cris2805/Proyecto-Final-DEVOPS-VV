import { expect, test } from '@playwright/test';

test('Login carga correctamente', async ({ page }) => {
  await page.goto('/login');

  await expect(page.getByRole('heading', { name: /Bienvenido de nuevo/i })).toBeVisible();
  await expect(page.getByPlaceholder('tu@correo.com')).toBeVisible();
  await expect(page.getByRole('button', { name: /Iniciar sesion|Iniciar sesión/i })).toBeVisible();
});

test('Gestion de tareas permite crear, cambiar estado y eliminar una tarea', async ({ page }) => {
  const taskTitle = `Tarea E2E ${Date.now()}`;

  await page.goto('/tasks');
  await expect(page.getByRole('heading', { name: /Gestion de tareas|Gestión de tareas/i })).toBeVisible();

  await page.getByRole('button', { name: /Nueva tarea/i }).click();
  await page.getByLabel(/Titulo de la tarea/i).fill(taskTitle);
  await page.getByLabel(/Descripcion/i).fill('Tarea creada desde Playwright para evidencia E2E.');
  await page.getByLabel(/Fecha limite/i).locator('input').fill('2026-07-10');
  await page.getByLabel(/Estado/i).selectOption('pendiente');
  await page.getByLabel(/Prioridad/i).selectOption('alta');
  await page.getByLabel(/Responsable/i).fill('QA E2E');
  await page.getByLabel(/Proyecto/i).fill('TaskFlow V&V');
  await page.getByLabel(/Etiquetas/i).fill('e2e,playwright');
  await page.getByRole('button', { name: /Guardar/i }).click();

  const createdRow = page.locator('tr').filter({ hasText: taskTitle });
  await expect(createdRow).toBeVisible();

  await createdRow.locator('select').selectOption('en_progreso');
  await expect(createdRow.locator('select')).toHaveValue('en_progreso');

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain(taskTitle);
    await dialog.accept();
  });
  await createdRow.getByTitle('Eliminar tarea').click();

  await expect(createdRow).toHaveCount(0);
});
