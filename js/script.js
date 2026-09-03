document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. MOBILE NAVIGATION TOGGLE
       ========================================= */

    const menuBtn = document.querySelector('.btn');
    const menuCont = document.querySelector('nav');

    if (menuBtn && menuCont) {
        menuBtn.addEventListener('click', () => {
            menuCont.classList.toggle('active');
        });
    }


    /* =========================================
       2. ACTIVE NAVIGATION PAGE
       ========================================= */

    let currentPage = window.location.pathname.split('/').pop();

    // If there is no filename, use index.html
    if (currentPage === '') {
        currentPage = 'index.html';
    }

    const navLinks = document.querySelectorAll(
        'header nav .menu-content ul li a'
    );
    navLinks.forEach(link => {

        let linkPage = link.getAttribute('href');

        // Make sure the link exists
        if (!linkPage) return;

        // Remove # from links such as about.html#section
        linkPage = linkPage.split('#')[0];

        // Add active class to current page
        if (linkPage === currentPage) {
            link.parentElement.classList.add('active');
        }

    });


    /* =========================================
       3. TIMELINE ANIMATION
       ========================================= */

    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach(item => {
        item.classList.add('show');
    });


    /* =========================================
       4. PRODUCT FILTER
       ========================================= */

    const filterButtons = document.querySelectorAll(
        '.filter-btn .btns'
    );

    const productItems = document.querySelectorAll(
        '.product > .row > .col-md-3'
    );


    // Set "All" button active by default
    if (filterButtons.length > 0) {
        filterButtons[0].classList.add('active');
    }


    filterButtons.forEach(button => {

        button.addEventListener('click', () => {

            // Remove active from all filter buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });

            // Add active to clicked button
            button.classList.add('active');


            // Get selected category
            const filterValue = button.textContent
                .trim()
                .toLowerCase();


            // Filter products
            productItems.forEach(item => {

                const categoryElement = item.querySelector(
                    '.head p'
                );

                const category = categoryElement
                    ? categoryElement.textContent.trim().toLowerCase()
                    : '';

                if (
                    filterValue === 'all' ||
                    category === filterValue
                ) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }

            });

        });

    });

        let add = document.querySelectorAll('.price .cont .add');
    let cartCount = JSON.parse(sessionStorage.getItem('cartQuantity')) || 0;
    let show = document.querySelector('.cart .show');

    if (show) {
        show.textContent = cartCount;
        show.style.display = cartCount > 0 ? 'block' : 'none';
    }

    add.forEach((button) => {
        button.addEventListener('click', () => {
            button.querySelector('p').textContent = 'Added';
            button.querySelector('i').className = 'bi bi-check-lg';
            button.classList.add('added');

            setTimeout(() => {
                button.querySelector('p').textContent = 'Add';
                button.querySelector('i').className = 'bi bi-cart';
                button.classList.remove('added');
            }, 3000);

            cartCount++;
            sessionStorage.setItem("cartQuantity", JSON.stringify(cartCount));

            if (show) {
                show.textContent = cartCount;
                show.style.display = 'block';
            }
        });
    });
    
});