import { parse } from 'dotenv';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('*', cors());

// Маршрут для проверки, что сервер живой
app.get('/', (c) => c.text('Бэкенд фермы запущен!'));

// Роут для авторизации и уведомлений
app.post('/auth/telegram', async (c) => {
    const user = await c.req.json();
    const botToken = c.env.BOT_TOKEN;

    // Отправляем приветственное сообщение через Bot API напрямую
    const text = `✅ Авторизация успешна!\nПривет, ${user.first_name}! Теперь я буду присылать уведомления о таймерах сюда.`;
    
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: user.id,
            text: text
        })
    });

    return c.json({ success: true, message: 'User recognized' });
});

// Роут для уведомлений от таймеров
app.post('/notify', async (c) => {
    const { chatId, message } = await c.req.json();
    const botToken = c.env.BOT_TOKEN;

    if (!chatId) return c.json({ success: false, error: 'No user ID' }, 400);

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: `⏰ ТАЙМЕР: ${message}`,
            parse_mode: 'HTML'
        })
    });

    return c.json({ success: true });
});

export default app;