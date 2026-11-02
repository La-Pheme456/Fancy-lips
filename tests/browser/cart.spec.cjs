const { test, expect } = require('@playwright/test');

test('add, reload, change quantities, send enquiry and empty the cart', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/products.html');
  await page.locator('.add').first().click();
  await expect(page.locator('.cart .show')).toHaveText('1');
  await page.goto('/cart.html');
  await expect(page.locator('.cart-product')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('.quantity-number')).toHaveText('1');
  await page.getByRole('button', { name: 'Increase quantity' }).click();
  await expect(page.locator('.quantity-number')).toHaveText('2');
  await expect(page.locator('.increase')).toBeFocused();
  await expect(page.locator('.grand-total strong')).toHaveText('$59.97');
  const href = await page.locator('.whatsapp-btn').getAttribute('href');
  const text = new URL(href).searchParams.get('text');
  expect(text).toContain('Estimated total: $59.97 USD');
  expect(text).toContain('Quantity: 2');
  await page.getByRole('button', { name: 'Decrease quantity' }).click();
  await expect(page.locator('.quantity-number')).toHaveText('1');
  await page.getByRole('button', { name: 'Remove Rose Gold Shimmer' }).click();
  await expect(page.locator('#box')).toBeVisible();
  await expect(page.locator('#box a')).toBeFocused();
  await page.reload();
  await expect(page.locator('#box')).toBeVisible();
  expect(errors).toEqual([]);
});

test('malformed saved JSON recovers without a JavaScript error', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('cartProducts', '{broken'));
  await page.goto('/cart.html');
  await expect(page.locator('#box')).toBeVisible();
  await expect(page.locator('.cart-product')).toHaveCount(0);
});

test('stored HTML is rendered as text', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('cartProducts', JSON.stringify([{ id: '1', name: '<img src=x onerror="window.injected=true">', description: '<script>bad</script>', category: 'red', image: 'img/img1.jfif', price: 22.99, quantity: 1 }])));
  await page.goto('/cart.html');
  await expect(page.locator('.product-name h2')).toHaveText('<img src=x onerror="window.injected=true">');
  await expect(page.locator('.product-name img, .product-name script')).toHaveCount(0);
  expect(await page.evaluate(() => window.injected)).toBeUndefined();
});

test('blocked storage preserves an in-memory cart and explains the limit', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('blocked'); } }));
  await page.goto('/products.html');
  await page.locator('.add').first().click();
  await expect(page.locator('.cart .show')).toHaveText('1');
  await expect(page.getByRole('status')).toContainText('on this page only');
});

test('mobile menu works with keyboard and Escape restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/cart.html');
  const button = page.locator('.menu-toggle');
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(button).toBeFocused();
  expect(await page.locator('#primary-navigation').evaluate(node => node.inert)).toBe(true);
});
