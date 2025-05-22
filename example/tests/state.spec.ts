import { test, expect } from '@playwright/test';

test('command copy doesn\'t have stale state', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Increment' }).click();
  await expect(page.locator('#root')).toContainText('Count: 1');
  await page.getByRole('button', { name: 'Increment' }).click();
  await expect(page.locator('#root')).toContainText('Count: 2');
  await page.getByRole('button', { name: 'Increment' }).click();
  await expect(page.locator('#root')).toContainText('Count: 3');
  await page.getByRole('button', { name: 'search' }).click();
  await page.getByRole('button', { name: '🔄 stateUpdates Ctrl u' }).click();
  await expect(page.locator('#root')).toContainText('Command Copy: 3');
});