import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library'; // Используем Google Auth Library для JWT

// Загружаем данные из переменных окружения
const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY); // Путь к ключам
const spreadsheetId = process.env.SPREADSHEET_ID; // ID таблицы

// Создаём объект для Google Spreadsheet
const doc = new GoogleSpreadsheet(spreadsheetId);

export default async function handler(req, res) {
  try {
    // Создаём авторизацию через сервисный аккаунт
    const authClient = new JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    // Авторизуемся с помощью клиента
    await doc.useOAuth2Client(authClient);

    // Загружаем информацию о таблице
    await doc.loadInfo(); // Загружаем информацию о таблице

    const sheet = doc.sheetsByIndex[0]; // Получаем первый лист
    const rows = await sheet.getRows(); // Получаем все строки данных

    res.status(200).json(rows); // Возвращаем данные
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    res.status(500).json({ error: 'Ошибка при загрузке базы данных' });
  }
}
