window.addEventListener("load", () => {
    const preloader = document.querySelector(".preloader");

    if(!preloader) return;

    requestAnimationFrame(() => {
        preloader.classList.add("hide");

        preloader.addEventListener("transitionend", () => {
            preloader.remove();
        }, { once: true });
    });
});


document.addEventListener('DOMContentLoaded', () => {
  let menuButton = document.querySelector('.btn');
  let menuContent = document.querySelector('nav');

  if (menuButton && menuContent) {
    menuButton.addEventListener('click', () => {
      menuContent.classList.toggle('active');
    });
  }

  let currentPage = window.location.pathname.split('/').pop();
  let navLinks = document.querySelectorAll('.menu-content ul li a');

  navLinks.forEach((link) => {
    let linkPage = link.getAttribute('href');

    if (linkPage === currentPage) {
      link.parentElement.classList.add('active');
    }
  });

  let cart = JSON.parse(sessionStorage.getItem('cartProducts')) || [];
  let show = document.querySelector('.cart .show');

  function updateCartCount() {
    let cartCount = cart.reduce((total, product) => total + product.quantity, 0);

    sessionStorage.setItem('cartQuantity', JSON.stringify(cartCount));

    if (show) {
      show.textContent = cartCount;
      show.style.display = cartCount > 0 ? 'block' : 'none';
    }
  }

  function saveCart() {
    sessionStorage.setItem('cartProducts', JSON.stringify(cart));
    updateCartCount();
  }

  let addButtons = document.querySelectorAll('.price .cont .add');

  addButtons.forEach((button) => {
    button.addEventListener('click', function () {
      let productCard = button.closest('.img');

      if (!productCard) return;

      let image = productCard.querySelector('img').src;
      let name = productCard.querySelector('.text h3').textContent.trim();
      let description = productCard.querySelector('.text p').textContent.trim();
      let category = productCard.querySelector('.head p').textContent.trim();
      let priceText = productCard.querySelector('.price h2').textContent.trim();
      let price = parseFloat(priceText.replace('$', ''));
      let id = button.dataset.id || name;

      let existingProduct = cart.find((product) => product.id === id);

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.push({
          id,
          image,
          name,
          description,
          category,
          price,
          quantity: 1
        });
      }

      saveCart();

      let buttonText = button.querySelector('p');
      let buttonIcon = button.querySelector('i');

      if (buttonText) buttonText.textContent = 'Added';
      if (buttonIcon) buttonIcon.className = 'bi bi-check-lg';

      button.classList.add('added');

      setTimeout(() => {
        if (buttonText) buttonText.textContent = 'Add';
        if (buttonIcon) buttonIcon.className = 'bi bi-cart';
        button.classList.remove('added');
      }, 3000);
    });
  });

  updateCartCount();

  let selectProduct = document.querySelector('#select-product');
  let emptyCart = document.querySelector('#box');

  if (selectProduct && emptyCart) {
    let cartContainer = selectProduct.querySelector('.cart-products');

    function showEmptyCart() {
      selectProduct.style.display = 'none';
      emptyCart.style.display = 'block';
    }

    function showCart() {
      selectProduct.style.display = 'block';
      emptyCart.style.display = 'none';
    }

    function displayCart() {
      cart = JSON.parse(sessionStorage.getItem('cartProducts')) || [];

      if (cart.length === 0) {
        showEmptyCart();
        updateCartCount();
        return;
      }

      showCart();
      cartContainer.innerHTML = '';

      cart.forEach((product, index) => {
        let cartProduct = document.createElement('div');
        cartProduct.classList.add('cart-product');

        cartProduct.innerHTML = `
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
          </div>

          <div class="product-details">
            <div class="product-top">
              <div class="product-name">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <span class="product-color">${product.category}</span>
              </div>

              <button type="button" class="delete-product" aria-label="Delete item">
                <i class="bi bi-trash3"></i>
              </button>
            </div>

            <div class="product-bottom">
              <div class="quantity">
                <button type="button" class="quantity-btn decrease" aria-label="Decrease quantity">
                  <i class="bi bi-dash"></i>
                </button>

                <span class="quantity-number">${product.quantity}</span>

                <button type="button" class="quantity-btn increase" aria-label="Increase quantity">
                  <i class="bi bi-plus"></i>
                </button>
              </div>

              <p class="product-price">$${product.price.toFixed(2)}</p>
            </div>
          </div>
        `;

        cartContainer.appendChild(cartProduct);

        let deleteButton = cartProduct.querySelector('.delete-product');
        deleteButton.addEventListener('click', () => {
          cart.splice(index, 1);
          saveCart();
          displayCart();
        });

        let increaseButton = cartProduct.querySelector('.increase');
        increaseButton.addEventListener('click', () => {
          cart[index].quantity++;
          saveCart();
          displayCart();
        });

        let decreaseButton = cartProduct.querySelector('.decrease');
        decreaseButton.addEventListener('click', () => {
          if (cart[index].quantity > 1) {
            cart[index].quantity--;
          } else {
            cart.splice(index, 1);
          }

          saveCart();
          displayCart();
        });
      });

      let totalItems = cart.reduce((total, product) => total + product.quantity, 0);
      let cartHeading = selectProduct.querySelector('.cart-heading p');

      if (cartHeading) {
        cartHeading.textContent = totalItems + (totalItems === 1 ? ' item in your cart' : ' items in your cart');
      }

      updateOrderSummary();
    }

    function updateOrderSummary() {
      let subtotal = cart.reduce((total, product) => total + (product.price * product.quantity), 0);
      let shipping = subtotal >= 75 ? 0 : 5.99;
      let tax = subtotal * 0.08;
      let grandTotal = subtotal + shipping + tax;

      let summaryRows = selectProduct.querySelectorAll('.summary-row');

      if (summaryRows[0]) {
        summaryRows[0].querySelector('strong').textContent = '$' + subtotal.toFixed(2);
      }

      if (summaryRows[1]) {
        summaryRows[1].querySelector('strong').textContent = shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2);
      }

      if (summaryRows[2]) {
        summaryRows[2].querySelector('strong').textContent = '$' + tax.toFixed(2);
      }

      let grandTotalElement = selectProduct.querySelector('.grand-total strong');

      if (grandTotalElement) {
        grandTotalElement.textContent = '$' + grandTotal.toFixed(2);
      }

      let shippingMessage = selectProduct.querySelector('.shipping-message p');

      if (shippingMessage) {
        if (subtotal >= 75) {
          shippingMessage.innerHTML = '<strong>You qualify for free shipping!</strong>';
        } else {
          let amountNeeded = 75 - subtotal;
          shippingMessage.innerHTML = 'Add <strong>$' + amountNeeded.toFixed(2) + '</strong> more for free shipping!';
        }
      }
    }
    displayCart();
  }
    // Order via WhatsApp
  let whatsappButton = document.querySelector('.whatsapp-btn');

  if (whatsappButton) {
    whatsappButton.addEventListener('click', (event) => {
      event.preventDefault();

      let currentCart = JSON.parse(sessionStorage.getItem('cartProducts')) || [];

      if (currentCart.length === 0) {
        alert('Your cart is empty. Please add a product before ordering.');
        return;
      }

      let orderMessage = `Hello Fancy Lips

I would like to place an order for the following items:

*Order Details*

`;

      currentCart.forEach((product, index) => {
        let itemTotal = product.price * product.quantity;

        orderMessage += `${index + 1}. *${product.name}*
Category: ${product.category}
Quantity: ${product.quantity}
Price: $${product.price.toFixed(2)} each
Item Total: $${itemTotal.toFixed(2)}

`;
      });

      let subtotal = currentCart.reduce(
        (total, product) => total + (product.price * product.quantity),
        0
      );

      let shipping = subtotal >= 75 ? 0 : 5.99;
      let tax = subtotal * 0.08;
      let grandTotal = subtotal + shipping + tax;

      orderMessage += `─────────────
Subtotal: $${subtotal.toFixed(2)}
Shipping: ${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}
Tax (8%): $${tax.toFixed(2)}
*Grand Total: $${grandTotal.toFixed(2)}*

Please let me know the next steps for completing my order.

Thank you!`;
      let whatsappNumber = '2348103964532';
      let whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;

      window.open(whatsappURL, '_blank');
    });
  }
});
