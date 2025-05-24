// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Eleventy Site Tests', () => {
  test('Homepage Test', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Welcome to My Personal Homepage/);
    await expect(page.getByRole('heading', { name: 'Welcome to My Personal Homepage!', level: 1 })).toBeVisible();
  });

  test.describe('Navigation Tests', () => {
    test('Navigate to About Me page', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: 'About Me' }).click();
      await expect(page).toHaveURL(/.*\/about\//);
      await expect(page.getByRole('heading', { name: 'About Me', level: 1 })).toBeVisible();
    });

    test('Navigate to Blog page', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: 'Blog' }).click();
      await expect(page).toHaveURL(/.*\/blog\//);
      await expect(page.getByRole('heading', { name: 'My Blog', level: 1 })).toBeVisible();
    });

    test('Navigate to Photography page', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: 'Photography' }).click();
      await expect(page).toHaveURL(/.*\/photography\//);
      await expect(page.getByRole('heading', { name: 'Photography', level: 1 })).toBeVisible();
    });
  });

  test.describe('Blog Functionality Tests', () => {
    test('Published and draft posts on Blog page', async ({ page }) => {
      await page.goto('/blog/');
      // Check for the published post
      await expect(page.getByRole('link', { name: 'My First Blog Post' })).toBeVisible();
      // Check that the draft post is NOT visible
      await expect(page.getByText('A Future Masterpiece (Draft)')).not.toBeVisible();
    });
  });

  test.describe('Admin Page - Drafts Test', () => {
    test('Drafts visibility on Admin page', async ({ page }) => {
      await page.goto('/admin/');
      await expect(page.getByRole('heading', { name: 'Draft Posts - Admin', level: 1 })).toBeVisible();
      
      // Check that the draft post IS visible (checking for text that includes the title)
      // The admin page lists draft titles like: <strong>A Future Masterpiece (Draft)</strong> (Filename: <code>draft-post.md</code>)
      await expect(page.getByText('A Future Masterpiece (Draft)')).toBeVisible();
      await expect(page.getByText('Filename: draft-post.md')).toBeVisible();

      // Check that the published post is NOT visible
      await expect(page.getByText('My First Blog Post')).not.toBeVisible();
    });
  });
});
