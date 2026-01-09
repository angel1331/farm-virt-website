const hamburgerBtn = document.getElementById('hamburger-toggle');
const sidebar = document.getElementById('sidebar');

hamburgerBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

document.querySelectorAll('.nav-url-container').forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });
});

document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});