/* Shared cart rules for the browser and Node's test runner. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.FancyCart = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const MAX_QUANTITY = 99;
  const rules = Object.freeze({ currency: 'USD', shippingCents: 599, freeShippingCents: 7500, taxBasisPoints: 800 });
  const money = cents => new Intl.NumberFormat('en-US', { style: 'currency', currency: rules.currency }).format(cents / 100);

  function normalizeCart(value) {
    if (!Array.isArray(value)) return [];
    const items = new Map();
    for (const item of value.slice(0, 100)) {
      if (!item || typeof item !== 'object') continue;
      const validText = key => typeof item[key] === 'string' && item[key].length <= 500;
      if (!['id', 'name', 'description', 'category', 'image'].every(validText)) continue;
      if (!item.id.trim() || !item.name.trim()) continue;
      if (!Number.isFinite(item.price) || Math.round(item.price * 100) < 1 || item.price > 10000) continue;
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_QUANTITY) continue;
      // Keep only repository image paths; storage must not inject arbitrary URLs.
      const image = item.image.match(/^(?:https?:\/\/[^/]+\/)?(?:[^?#]*\/)?img\/(img[1-8]\.jfif)$/);
      if (!image) continue;
      const existing = items.get(item.id);
      if (existing) existing.quantity = Math.min(MAX_QUANTITY, existing.quantity + item.quantity);
      else items.set(item.id, { id: item.id, name: item.name, description: item.description, category: item.category, image: 'img/' + image[1], price: Math.round(item.price * 100) / 100, quantity: item.quantity });
    }
    return [...items.values()];
  }

  function readCart(storage) {
    try { return normalizeCart(JSON.parse(storage.getItem('cartProducts'))); }
    catch { return []; }
  }

  function writeCart(storage, cart) {
    try {
      const items = normalizeCart(cart);
      storage.setItem('cartProducts', JSON.stringify(items));
      storage.setItem('cartQuantity', String(items.reduce((total, item) => total + item.quantity, 0)));
      return true;
    } catch { return false; }
  }

  function calculateOrder(cart) {
    const items = normalizeCart(cart);
    const subtotalCents = items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0);
    const shippingCents = items.length && subtotalCents < rules.freeShippingCents ? rules.shippingCents : 0;
    const taxCents = Math.round(subtotalCents * rules.taxBasisPoints / 10000);
    return { subtotalCents, shippingCents, taxCents, totalCents: subtotalCents + shippingCents + taxCents, amountToFreeShippingCents: Math.max(0, rules.freeShippingCents - subtotalCents) };
  }

  function orderMessage(cart) {
    const items = normalizeCart(cart);
    const order = calculateOrder(items);
    return ['Hello Fancy Lips,', '', 'I would like to enquire about these items:', '',
      ...items.map((item, i) => `${i + 1}. ${item.name}\nCategory: ${item.category}\nQuantity: ${item.quantity}\nPrice: ${money(Math.round(item.price * 100))} each\nItem total: ${money(Math.round(item.price * 100) * item.quantity)}`), '',
      `Subtotal: ${money(order.subtotalCents)}`, `Estimated shipping: ${money(order.shippingCents)}`,
      `Demo tax estimate (8%): ${money(order.taxCents)}`, `Estimated total: ${money(order.totalCents)} USD`, '',
      'Please confirm availability, currency, delivery charges, applicable tax and the final total before payment.'].join('\n');
  }
  return { MAX_QUANTITY, rules, money, normalizeCart, readCart, writeCart, calculateOrder, orderMessage };
});
