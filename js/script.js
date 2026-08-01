var menuBtn = document.querySelector('.btn'),
    menuCont = document.querySelector('nav');
function showMenu () {
    menuCont.classList.toggle('active')
}
menuBtn.addEventListener('click', showMenu);

document.querySelectorAll('.timeline-item').forEach(item => {
        item.classList.add('show');
    });