import { GoogleSpreadsheet } from 'google-spreadsheet';

// Получаем значения из переменных окружения
const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY); 
const spreadsheetId = process.env.SPREADSHEET_ID;

const doc = new GoogleSpreadsheet(spreadsheetId);

export default async function handler(req, res) {
  try {
    // Авторизация с использованием сервисного аккаунта
    await doc.useServiceAccountAuth(creds); // если эта строка не работает, заменим на doc.authorize()
    await doc.loadInfo(); // Загружаем таблицу
    const sheet = doc.sheetsByIndex[0]; // Получаем первый лист таблицы

    const rows = await sheet.getRows(); // Получаем строки данных

    // Отправляем данные как ответ
    res.status(200).json(rows);
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    res.status(500).json({ error: 'Ошибка при загрузке базы данных' });
  }
}
