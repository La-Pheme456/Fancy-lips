var menuBtn = document.querySelector('.btn'),
    menuCont = document.querySelector('nav');
function showMenu () {
    menuCont.classList.toggle('active')
}
menuBtn.addEventListener('click', showMenu);

document.querySelectorAll('.timeline-item').forEach(item => {
        item.classList.add('show');
    });


let score = 75;

if (score >= 90) {
    console.log("Grade A");
} else if (score >= 80) {
    console.log("Grade B");
} else if (score >= 70) {
    console.log("Grade C");
} else {
    console.log("Failed");
}