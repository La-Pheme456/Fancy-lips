document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Toggle
    const menuBtn = document.querySelector('.btn');
    const menuCont = document.querySelector('nav');

    if (menuBtn && menuCont) {
        menuBtn.addEventListener('click', () => {
            menuCont.classList.toggle('active');
        });
    }

    // 2. Timeline Animation Initialization
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.classList.add('show');
    });

    // 3. Product Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn .btns');
    
    // Direct child selector (>) prevents selecting the nested .col-md-6 price columns
    const productItems = document.querySelectorAll('.product > .row > .col-md-3');

    // Set first button ("All") active by default
    if (filterButtons.length > 0) {
        filterButtons[0].classList.add('active');
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.textContent.trim().toLowerCase();

            // Match product category
            productItems.forEach(item => {
                const categoryElement = item.querySelector('.price p');
                const category = categoryElement ? categoryElement.textContent.trim().toLowerCase() : '';

                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});