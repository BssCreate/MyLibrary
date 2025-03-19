const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const fs = require('fs');

// Загружаем ключи из JSON-файла
const creds = JSON.parse(fs.readFileSync('credentials.json'));

// ID таблицы (из URL Google Sheets)
const SHEET_ID = '1XOe29zxWW0mgVrZQSAu-9TQ4i7dfvYOBkq7-VvWg2nY';

// Функция для получения данных
async function fetchUsersData() {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    
    const auth = new JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    await doc.useServiceAccountAuth(auth);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByIndex[0]; // Первый лист
    const rows = await sheet.getRows(); // Получаем все строки

    let users = {};
    rows.forEach(row => {
        users[row['Номер телефона'].replace(/\D/g, '')] = row['Пароль'];
    });

    return users;
}

// Экспортируем функцию
module.exports = { fetchUsersData };
