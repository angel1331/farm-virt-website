require('dotenv').config();
const express = require('express');
const { Telegraf } = require('telegraf');
const cors = require('cors');

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

app.use(cors()); // Чтобы фронтенд мог достучаться до бэкенда
app.use(express.json());

// Переменная для хранения твоего ID (пока не сделали авторизацию)
// Напиши боту любое сообщение в ТГ, и в консоли увидишь свой ID
let adminChatId = null;

bot.on('text', (ctx) => {
    adminChatId = ctx.chat.id;
    console.log(`Твой Chat ID сохранен: ${adminChatId}`);
    ctx.reply(`Привет! Теперь я знаю твой ID (${adminChatId}) и буду слать сюда уведомления.`);
});

// Роут (путь) для получения сигналов от таймера
app.post('/notify', (req) => {
    const { message } = req.body;
    
    if (adminChatId) {
        bot.telegram.sendMessage(adminChatId, `⏰ ТАЙМЕР: ${message}`);
        console.log('Уведомление отправлено в Telegram');
    } else {
        console.log('Ошибка: Бот еще не знает твой ID. Напиши ему что-нибудь в Telegram!');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    bot.launch(); // Запуск бота
    console.log('Telegram бот готов к работе');
});