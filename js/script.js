'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    preloader.classList.add('hide');
    setTimeout(() => preloader.remove(), 1000);
  }
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('header nav');
  const menu = document.querySelector('#primary-navigation');
  const mobile = window.matchMedia('(max-width: 982px)');
  const setMenuOpen = open => {
    nav.classList.toggle('active', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.inert = mobile.matches && !open;
  };
  if (menuButton && nav && menu) {
    setMenuOpen(false);
    menuButton.addEventListener('click', () => setMenuOpen(!nav.classList.contains('active')));
    mobile.addEventListener('change', () => setMenuOpen(false));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('active')) {
        setMenuOpen(false);
        menuButton.focus();
      }
    });
  }
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu-content ul li a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.parentElement.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
  const api = window.FancyCart;
  let storage;
  try { storage = window.sessionStorage; } catch { /* Continue with an in-memory cart. */ }
  let cart = api.readCart(storage);
  const status = document.querySelector('#cart-status');
  const notify = message => { if (status) status.textContent = message; };
  const badge = document.querySelector('.cart .show');
  const selected = document.querySelector('#select-product');
  const empty = document.querySelector('#box');
  const whatsapp = document.querySelector('.whatsapp-btn');

  function saveCart() {
    const persisted = api.writeCart(storage, cart);
    if (!persisted) notify('Your cart is available on this page only because browser storage is unavailable.');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (badge) {
      badge.textContent = count;
      badge.style.display = count ? 'block' : 'none';
    }
    if (whatsapp) whatsapp.href = 'https://wa.me/2348103964532?text=' + encodeURIComponent(api.orderMessage(cart));
    return persisted;
  }
  document.querySelectorAll('.price .cont .add').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.img');
      const product = {
        id: button.dataset.id || card.querySelector('.text h3').textContent.trim(),
        image: card.querySelector('img').getAttribute('src'),
        name: card.querySelector('.text h3').textContent.trim(),
        description: card.querySelector('.text p').textContent.trim(),
        category: card.querySelector('.head p').textContent.trim(),
        price: Number(card.querySelector('.price h2').textContent.trim().replace('$', '')),
        quantity: 1
      };
      if (!api.normalizeCart([product]).length) { notify('This product is unavailable. Please contact us on WhatsApp.'); return; }
      const existing = cart.find(item => item.id === product.id);
      if (existing?.quantity === api.MAX_QUANTITY) { notify('The maximum quantity per item is ' + api.MAX_QUANTITY + '.'); return; }
      if (existing) existing.quantity++;
      else cart.push(product);
      if (saveCart()) notify(product.name + ' added to your cart.');
      const text = button.querySelector('.add-label');
      text.textContent = 'Added';
      setTimeout(() => { text.textContent = 'Add'; }, 2000);
    });
  });
  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function action(className, label, icon, handler) {
    const button = element('button', className);
    button.type = 'button';
    button.setAttribute('aria-label', label);
    const glyph = element('i', icon);
    glyph.setAttribute('aria-hidden', 'true');
    button.append(glyph);
    button.addEventListener('click', handler);
    return button;
  }
  function displayCart(focusIndex, focusSelector) {
    if (!selected || !empty) return;
    selected.style.display = cart.length ? 'block' : 'none';
    empty.style.display = cart.length ? 'none' : 'block';
    const container = selected.querySelector('.cart-products');
    container.replaceChildren();
    cart.forEach((product, index) => {
      const row = element('div', 'cart-product');
      const imageWrap = element('div', 'product-image');
      const image = document.createElement('img');
      image.src = product.image;
      image.alt = product.name;
      imageWrap.append(image);
      const details = element('div', 'product-details');
      const top = element('div', 'product-top');
      const name = element('div', 'product-name');
      name.append(element('h2', '', product.name), element('p', '', product.description), element('span', 'product-color', product.category));
      const change = (delta, selector) => {
        product.quantity += delta;
        if (product.quantity < 1) cart.splice(index, 1);
        const persisted = saveCart();
        displayCart(index, selector);
        if (persisted) notify('Cart updated.');
      };
      top.append(name, action('delete-product', 'Remove ' + product.name, 'bi bi-trash3', () => {
        cart.splice(index, 1);
        const persisted = saveCart();
        displayCart(Math.min(index, cart.length - 1), '.delete-product');
        if (persisted) notify(product.name + ' removed.');
      }));
      const bottom = element('div', 'product-bottom');
      const quantity = element('div', 'quantity');
      const increase = action('quantity-btn increase', 'Increase quantity of ' + product.name, 'bi bi-plus', () => change(1, '.increase'));
      increase.disabled = product.quantity >= api.MAX_QUANTITY;
      quantity.append(action('quantity-btn decrease', 'Decrease quantity of ' + product.name, 'bi bi-dash', () => change(-1, '.decrease')), element('span', 'quantity-number', product.quantity), increase);
      bottom.append(quantity, element('p', 'product-price', api.money(Math.round(product.price * 100))));
      details.append(top, bottom);
      row.append(imageWrap, details);
      container.append(row);
    });
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    selected.querySelector('.cart-heading p').textContent = count + (count === 1 ? ' item in your cart' : ' items in your cart');
    const order = api.calculateOrder(cart);
    const amounts = [order.subtotalCents, order.shippingCents, order.taxCents];
    selected.querySelectorAll('.summary-row strong').forEach((node, i) => { node.textContent = api.money(amounts[i]); });
    selected.querySelector('.grand-total strong').textContent = api.money(order.totalCents);
    selected.querySelector('.shipping-message p').textContent = order.amountToFreeShippingCents ? 'Add ' + api.money(order.amountToFreeShippingCents) + ' for the demo free-shipping threshold.' : 'Demo free-shipping threshold reached.';
    if (focusSelector) {
      const target = container.children[Math.min(focusIndex, cart.length - 1)]?.querySelector(focusSelector);
      (target?.disabled ? target.parentElement.querySelector('.decrease') : target || empty.querySelector('a'))?.focus();
    }
  }
  saveCart();
  displayCart();
});
