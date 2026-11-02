const { test } = require('node:test');
const assert = require('node:assert/strict');
const cart = require('../js/cart.js');
const item = (price = 24.99, quantity = 1) => ({ id: '1', name: 'Rose Gold Shimmer', description: 'Shimmer', category: 'glitter', image: 'img/img1.jfif', price, quantity });

test('empty and malformed storage recover to an empty cart', () => {
  for (const value of [null, '{broken', '{}', 'null', '42']) assert.deepEqual(cart.readCart({ getItem: () => value }), []);
  assert.deepEqual(cart.readCart({ getItem() { throw new Error('blocked'); } }), []);
  assert.deepEqual(cart.readCart(undefined), []);
});
test('invalid quantities, prices and image URLs are rejected', () => {
  for (const quantity of [-1, 0, 1.5, 100, '2']) assert.deepEqual(cart.normalizeCart([item(5, quantity)]), []);
  for (const price of [-1, 0, 0.001, NaN, Infinity, '24.99', 10001]) assert.deepEqual(cart.normalizeCart([item(price)]), []);
  assert.deepEqual(cart.normalizeCart([{ ...item(), image: 'javascript:alert(1)' }]), []);
  assert.deepEqual(cart.normalizeCart([{ ...item(), image: 'https://evil.test/tracker.svg' }]), []);
});
test('legacy absolute images become local and duplicates respect the quantity limit', () => {
  const result = cart.normalizeCart([{ ...item(5, 60), image: 'https://fancy-lips.vercel.app/img/img1.jfif' }, item(5, 60)]);
  assert.equal(result.length, 1);
  assert.equal(result[0].quantity, 99);
  assert.equal(result[0].image, 'img/img1.jfif');
});
test('empty orders have no shipping or tax', () => {
  assert.deepEqual(cart.calculateOrder([]), { subtotalCents: 0, shippingCents: 0, taxCents: 0, totalCents: 0, amountToFreeShippingCents: 7500 });
});
test('shipping boundary and integer-cent tax rounding', () => {
  const below = cart.calculateOrder([item(74.99)]);
  assert.equal(below.shippingCents, 599);
  assert.equal(below.taxCents, 600);
  assert.equal(below.totalCents, 8698);
  assert.equal(cart.calculateOrder([item(75)]).shippingCents, 0);
  assert.equal(cart.calculateOrder([item(75.01)]).shippingCents, 0);
  assert.equal(cart.calculateOrder([item(0.1, 3)]).subtotalCents, 30);
});
test('summary and order enquiry use identical totals', () => {
  const items = [item(24.99, 3)];
  const order = cart.calculateOrder(items);
  assert.equal(order.subtotalCents, 7497);
  assert.equal(order.totalCents, 8696);
  assert.match(cart.orderMessage(items), /Estimated total: \$86\.96 USD/);
  assert.match(cart.orderMessage(items), /confirm availability, currency/i);
});
test('storage errors do not throw and valid data round-trips', () => {
  assert.equal(cart.writeCart(undefined, [item()]), false);
  const values = new Map();
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  assert.equal(cart.writeCart(storage, [item()]), true);
  assert.deepEqual(cart.readCart(storage), [item()]);
  assert.equal(values.get('cartQuantity'), '1');
});
