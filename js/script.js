// ======================================================
// ACTIVE NAVIGATION LINK
// ======================================================

let currentPage =
    window.location.pathname.split('/').pop();

let navLinks =
    document.querySelectorAll('.menu-content ul li a');


navLinks.forEach(function (link) {

    let linkPage =
        link.getAttribute('href');

    if (linkPage === currentPage) {

        link.parentElement.classList.add('active');

    }

});
// ======================================================
// FANCY LIPS - COMPLETE CART JAVASCRIPT
// ======================================================


// ======================================================
// GET CART FROM SESSION STORAGE
// ======================================================

let cart = JSON.parse(sessionStorage.getItem('cartProducts')) || [];


// ======================================================
// CART ICON COUNT
// ======================================================

let show = document.querySelector('.cart .show');


// ======================================================
// UPDATE CART COUNT
// ======================================================

function updateCartCount() {

    let cartCount = cart.reduce(function (total, product) {
        return total + product.quantity;
    }, 0);

    sessionStorage.setItem(
        'cartQuantity',
        JSON.stringify(cartCount)
    );

    if (show) {
        show.textContent = cartCount;

        if (cartCount > 0) {
            show.style.display = 'block';
        } else {
            show.style.display = 'none';
        }
    }
}


// ======================================================
// SAVE CART
// ======================================================

function saveCart() {

    sessionStorage.setItem(
        'cartProducts',
        JSON.stringify(cart)
    );

    updateCartCount();
}


// ======================================================
// PRODUCT PAGE - ADD TO CART
// ======================================================

let addButtons = document.querySelectorAll('.price .cont .add');


addButtons.forEach(function (button) {

    button.addEventListener('click', function () {

        // ----------------------------------------------
        // FIND THE PRODUCT CARD
        // ----------------------------------------------

        let productCard = button.closest('.img');


        // ----------------------------------------------
        // GET PRODUCT INFORMATION
        // ----------------------------------------------

        let image = productCard.querySelector('img').src;

        let name =
            productCard.querySelector('.text h3').textContent.trim();

        let description =
            productCard.querySelector('.text p').textContent.trim();

        let category =
            productCard.querySelector('.head p').textContent.trim();

        let priceText =
            productCard.querySelector('.price h2').textContent.trim();

        let price =
            parseFloat(priceText.replace('$', ''));


        // ----------------------------------------------
        // GET PRODUCT ID
        // ----------------------------------------------

        let id = button.dataset.id || name;


        // ----------------------------------------------
        // CHECK IF PRODUCT ALREADY EXISTS
        // ----------------------------------------------

        let existingProduct = cart.find(function (product) {
            return product.id === id;
        });


        // ----------------------------------------------
        // IF PRODUCT ALREADY EXISTS
        // ----------------------------------------------

        if (existingProduct) {

            existingProduct.quantity++;

        }


        // ----------------------------------------------
        // IF PRODUCT DOES NOT EXIST
        // ----------------------------------------------

        else {

            cart.push({
                id: id,
                image: image,
                name: name,
                description: description,
                category: category,
                price: price,
                quantity: 1
            });

        }


        // ----------------------------------------------
        // SAVE CART
        // ----------------------------------------------

        saveCart();


        // ----------------------------------------------
        // CHANGE BUTTON TO "ADDED"
        // ----------------------------------------------

        let buttonText =
            button.querySelector('p');

        let buttonIcon =
            button.querySelector('i');


        if (buttonText) {
            buttonText.textContent = 'Added';
        }


        if (buttonIcon) {
            buttonIcon.className = 'bi bi-check-lg';
        }


        button.classList.add('added');


        // ----------------------------------------------
        // CHANGE BUTTON BACK
        // ----------------------------------------------

        setTimeout(function () {

            if (buttonText) {
                buttonText.textContent = 'Add';
            }


            if (buttonIcon) {
                buttonIcon.className = 'bi bi-cart';
            }


            button.classList.remove('added');

        }, 3000);

    });

});


// ======================================================
// UPDATE CART COUNT WHEN PAGE LOADS
// ======================================================

updateCartCount();


// ======================================================
// CART PAGE
// ======================================================

let selectProduct =
    document.querySelector('#select-product');

let emptyCart =
    document.querySelector('#box');


// ======================================================
// ONLY RUN THIS PART ON CART.HTML
// ======================================================

if (selectProduct && emptyCart) {


    // ==================================================
    // CART PRODUCT CONTAINER
    // ==================================================

    let cartContainer =
        selectProduct.querySelector('.cart-products');


    // ==================================================
    // SHOW EMPTY CART
    // ==================================================

    function showEmptyCart() {

        selectProduct.style.display = 'none';

        emptyCart.style.display = 'block';
    }


    // ==================================================
    // SHOW CART
    // ==================================================

    function showCart() {

        selectProduct.style.display = 'block';

        emptyCart.style.display = 'none';
    }


    // ==================================================
    // DISPLAY CART
    // ==================================================

    function displayCart() {


        // ----------------------------------------------
        // GET LATEST CART
        // ----------------------------------------------

        cart =
            JSON.parse(
                sessionStorage.getItem('cartProducts')
            ) || [];


        // ----------------------------------------------
        // CHECK IF CART IS EMPTY
        // ----------------------------------------------

        if (cart.length === 0) {

            showEmptyCart();

            updateCartCount();

            return;
        }


        // ----------------------------------------------
        // SHOW CART
        // ----------------------------------------------

        showCart();


        // ----------------------------------------------
        // REMOVE THE SAMPLE PRODUCT FROM HTML
        // ----------------------------------------------

        cartContainer.innerHTML = '';


        // ----------------------------------------------
        // CREATE EVERY PRODUCT IN CART
        // ----------------------------------------------

        cart.forEach(function (product, index) {


            // ==========================================
            // CREATE CART PRODUCT
            // ==========================================

            let cartProduct =
                document.createElement('div');

            cartProduct.classList.add('cart-product');


            // ==========================================
            // CREATE PRODUCT HTML
            // ==========================================

            cartProduct.innerHTML = `

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>


                <div class="product-details">

                    <div class="product-top">

                        <div class="product-name">

                            <h2>
                                ${product.name}
                            </h2>

                            <p>
                                ${product.description}
                            </p>

                            <span class="product-color">
                                ${product.category}
                            </span>

                        </div>


                        <button
                            type="button"
                            class="delete-product"
                            aria-label="Delete item"
                        >

                            <i class="bi bi-trash3"></i>

                        </button>

                    </div>


                    <div class="product-bottom">

                        <div class="quantity">

                            <button
                                type="button"
                                class="quantity-btn decrease"
                                aria-label="Decrease quantity"
                            >

                                <i class="bi bi-dash"></i>

                            </button>


                            <span class="quantity-number">
                                ${product.quantity}
                            </span>


                            <button
                                type="button"
                                class="quantity-btn increase"
                                aria-label="Increase quantity"
                            >

                                <i class="bi bi-plus"></i>

                            </button>

                        </div>


                        <p class="product-price">
                            $${product.price.toFixed(2)}
                        </p>

                    </div>

                </div>

            `;


            // ==========================================
            // PUT PRODUCT INSIDE CART
            // ==========================================

            cartContainer.appendChild(cartProduct);


            // ==================================================
            // DELETE PRODUCT
            // ==================================================

            let deleteButton =
                cartProduct.querySelector('.delete-product');


            deleteButton.addEventListener('click', function () {

                // Remove product from array

                cart.splice(index, 1);


                // Save new cart

                saveCart();


                // Display cart again

                displayCart();

            });


            // ==================================================
            // PLUS BUTTON
            // ==================================================

            let increaseButton =
                cartProduct.querySelector('.increase');


            increaseButton.addEventListener('click', function () {

                // Increase quantity

                cart[index].quantity++;


                // Save

                saveCart();


                // Display again

                displayCart();

            });


            // ==================================================
            // MINUS BUTTON
            // ==================================================

            let decreaseButton =
                cartProduct.querySelector('.decrease');


            decreaseButton.addEventListener('click', function () {

                // ------------------------------------------
                // IF MORE THAN 1
                // ------------------------------------------

                if (cart[index].quantity > 1) {

                    cart[index].quantity--;

                }


                // ------------------------------------------
                // IF QUANTITY IS 1
                // REMOVE PRODUCT
                // ------------------------------------------

                else {

                    cart.splice(index, 1);

                }


                // ------------------------------------------
                // SAVE
                // ------------------------------------------

                saveCart();


                // ------------------------------------------
                // DISPLAY AGAIN
                // ------------------------------------------

                displayCart();

            });

        });


        // ==================================================
        // UPDATE CART HEADING
        // ==================================================

        let totalItems =
            cart.reduce(function (total, product) {

                return total + product.quantity;

            }, 0);


        let cartHeading =
            selectProduct.querySelector('.cart-heading p');


        if (cartHeading) {

            cartHeading.textContent =
                totalItems +
                (
                    totalItems === 1
                        ? ' item in your cart'
                        : ' items in your cart'
                );

        }


        // ==================================================
        // UPDATE ORDER SUMMARY
        // ==================================================

        updateOrderSummary();

    }


    // ======================================================
    // ORDER SUMMARY
    // ======================================================

    function updateOrderSummary() {


        // ----------------------------------------------
        // CALCULATE SUBTOTAL
        // ----------------------------------------------

        let subtotal =
            cart.reduce(function (total, product) {

                return total +
                    (
                        product.price *
                        product.quantity
                    );

            }, 0);


        // ----------------------------------------------
        // SHIPPING
        // ----------------------------------------------

        let shipping;

        if (subtotal >= 75) {

            shipping = 0;

        } else {

            shipping = 5.99;

        }


        // ----------------------------------------------
        // TAX
        // ----------------------------------------------

        let tax =
            subtotal * 0.08;


        // ----------------------------------------------
        // GRAND TOTAL
        // ----------------------------------------------

        let grandTotal =
            subtotal +
            shipping +
            tax;


        // ==================================================
        // SUMMARY ROWS
        // ==================================================

        let summaryRows =
            selectProduct.querySelectorAll('.summary-row');


        // ==================================================
        // SUBTOTAL
        // ==================================================

        if (summaryRows[0]) {

            summaryRows[0]
                .querySelector('strong')
                .textContent =
                '$' + subtotal.toFixed(2);

        }


        // ==================================================
        // SHIPPING
        // ==================================================

        if (summaryRows[1]) {

            summaryRows[1]
                .querySelector('strong')
                .textContent =
                shipping === 0
                    ? 'FREE'
                    : '$' + shipping.toFixed(2);

        }


        // ==================================================
        // TAX
        // ==================================================

        if (summaryRows[2]) {

            summaryRows[2]
                .querySelector('strong')
                .textContent =
                '$' + tax.toFixed(2);

        }


        // ==================================================
        // GRAND TOTAL
        // ==================================================

        let grandTotalElement =
            selectProduct.querySelector(
                '.grand-total strong'
            );


        if (grandTotalElement) {

            grandTotalElement.textContent =
                '$' + grandTotal.toFixed(2);

        }


        // ==================================================
        // SHIPPING MESSAGE
        // ==================================================

        let shippingMessage =
            selectProduct.querySelector(
                '.shipping-message p'
            );


        if (shippingMessage) {

            if (subtotal >= 75) {

                shippingMessage.innerHTML =
                    '<strong>You qualify for free shipping!</strong>';

            } else {

                let amountNeeded =
                    75 - subtotal;


                shippingMessage.innerHTML =
                    'Add <strong>$' +
                    amountNeeded.toFixed(2) +
                    '</strong> more for free shipping!';

            }

        }

    }


    // ======================================================
    // LOAD CART WHEN CART.HTML OPENS
    // ======================================================

    displayCart();

}