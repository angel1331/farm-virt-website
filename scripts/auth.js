const BACKEND_URL = 'https://farm-money-api.rakashev39.workers.dev';

function renderProfile(user) {
    const container = document.getElementById('telegram-auth-container');
    if (!container) {
        console.error("Контейнер для авторизации не найден!");
        return;
    }

    container.innerHTML = `
        <div class="user-card" style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 12px; border: 1px solid rgba(255,165,0,0.3);">
            <img src="${user.photo_url || 'https://via.placeholder.com/40'}" 
                 style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #ffa500; object-fit: cover;">
            <div style="text-align: left;">
                <div style="font-weight: bold; color: white; font-size: 14px;">${user.first_name}</div>
                <div style="font-size: 11px; color: #aaa;">ID: ${user.id}</div>
            </div>
            <button onclick="logout()" style="margin-left: 10px; background: none; border: none; color: #ff4d4d; cursor: pointer; font-size: 18px;">✕</button>
        </div>
    `;
}

window.logout = function() {
    localStorage.removeItem('tg_user');
    location.reload();
};

window.onTelegramAuth = function(user) {
    console.log("Авторизация прошла:", user);
    
    localStorage.setItem('tg_user', JSON.stringify(user));
    renderProfile(user);

    fetch(`${BACKEND_URL}/auth/telegram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(data => {
        console.log("Сервер подтвердил:", data);
        alert(`Привет, ${user.first_name}! Бот теперь на связи.`);
    })
    .catch(err => {
        console.error("Ошибка сервера:", err);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('tg_user');
    if (savedUser) {
        renderProfile(JSON.parse(savedUser));
    }
});