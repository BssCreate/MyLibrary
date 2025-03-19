import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async function handler(req, res) {
    try {
        console.log("Запуск API /api/users"); // Лог запуска

        if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
            throw new Error("Отсутствуют переменные окружения!");
        }

        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
        const auth = new JWT({
            email: process.env.GOOGLE_CLIENT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        console.log("Аутентификация прошла"); // Проверяем, дошло ли до этого момента

        await doc.useServiceAccountAuth(auth);
        await doc.loadInfo();

        console.log("Подключились к Google Таблице:", doc.title);

        const sheet = doc.sheetsByIndex[0]; // Первый лист
        const rows = await sheet.getRows(); // Все строки

        let users = {};
        rows.forEach(row => {
            users[row['Номер телефона'].replace(/\D/g, '')] = row['Пароль'];
        });

        console.log("Загружено пользователей:", Object.keys(users).length);
        res.status(200).json(users);
    } catch (error) {
        console.error("Ошибка API /api/users:", error);
        res.status(500).json({ error: 'Ошибка загрузки данных', details: error.message });
    }
}
