const hamburgerBtn = document.querySelector('.hamburger-btn');
const sideBar = document.querySelector('aside');
const menuItems = document.querySelectorAll('.sidebar a');

hamburgerBtn.addEventListener('click', () => {
    sideBar.classList.toggle('active');

    hamburgerBtn.classList.toggle('open');
})

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });
});