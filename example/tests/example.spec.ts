import { test, expect } from '@playwright/test';

test('The buttons work', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'search' }).click();
  await page.getByRole('button', { name: '👋 hello Say hello' }).click();
  await page.getByRole('textbox').fill('Bert');
  await page.getByRole('textbox').press('Enter');
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'search' }).click();
  await page.getByRole('button', { name: '👋 hello Say hello' }).click();
  await expect(page.getByRole('paragraph')).toContainText('Choose from the below options:');
  await page.getByRole('textbox').fill('Bert');
  await page.getByRole('textbox').press('Enter');
  await expect(page.locator('#root')).toContainText('Hello, Bert');
});

test('the search bar works', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'search' }).click();
  await page.getByRole('textbox').fill('hello');
  await page.getByRole('textbox').press('Enter');
  await expect(page.getByLabel("choose options")).toContainText('Choose from the below options:');
  await page.getByRole('textbox').fill('James');
  await page.getByRole('textbox').press('Enter');
  await expect(page.locator('#root')).toContainText('Hello, James');
})

test('state updates properly', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'search' }).click();
  await page.getByRole('button', { name: '🌙 dark mode Ctrl o' }).click();
  await expect(page.locator('#root')).toContainText('Dark Mode');
  await page.getByRole('button', { name: 'search' }).click();
  await expect(page.locator('body',)).toContainText('🌙light modeCtrlo');
  await page.getByRole('button', { name: '🌙 light mode Ctrl o' }).click();
  await expect(page.locator('#root')).toContainText('Light Mode');
  await expect(page.locator('#root')).toContainText('Light Mode');
})