function onTelegramAuth(user) {
    console.log("Данные от ТГ получены:", user);

    const BACKEND_URL = 'https://farm-money-api.rakashev39.workers.dev';

    fetch(`${BACKEND_URL}/auth/telegram`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`Авторизация успешна! Привет, ${user.first_name}`);
            
            localStorage.setItem('tg_user', JSON.stringify(user));
            
            location.reload(); 
        } else {
            alert("Ошибка: сервер не подтвердил подлинность данных.");
        }
    })
    .catch(error => {
        console.error("Ошибка при отправке на сервер:", error);
        alert("Не удалось связаться с сервером. Проверь запущен ли Node.js");
    });
}

function renderProfile(user) {
    const container = document.getElementById('telegram-auth-container');

    if(!container) return;

    container.innerHTML = `
        <div class="user-card" style="display: flex; align-items: center; gap: 10px; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 10px;">
            <img src="${user.photo_url || 'assets/default-avatar.png'}" 
                 style="width: 35px; height: 35px; border-radius: 50%; border: 1px solid #ffa500;">
            <div style="line-height: 1.2;">
                <div style="font-weight: bold; font-size: 14px; color: white;">${user.first_name}</div>
                <div style="font-size: 10px; color: #888;">ID: ${user.id}</div>
            </div>
        </div>
    `

    window.onTelegramAuth = function(user) {
        console.log("Авторизация прошла успешно: ", user);

        localStorage.setItem('tg_user', JSON.stringify(user));

        renderProfile(user);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const savedUser = localStorage.getItem('tg_user');

        if(savedUser) {
            renderProfile(JSON.parse(savedUser));
        }
    })
}