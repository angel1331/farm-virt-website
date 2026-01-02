function onTelegramAuth(user) {
    console.log("Данные от ТГ получены:", user);

    fetch('http://localhost:3000/auth/telegram', {
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