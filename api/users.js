import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library'; 

const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
const spreadsheetId = process.env.SPREADSHEET_ID;

const doc = new GoogleSpreadsheet(spreadsheetId);

export default async function handler(req, res) {
  try {
    // Создаем JWT клиент для авторизации
    const authClient = new JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    // Подключаем аутентификацию к Google Sheets
    await doc.useOAuth2Client(authClient);

    // Загружаем информацию о таблице
    await doc.loadInfo();

    // Получаем данные с первой таблицы
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    // Возвращаем данные
    res.status(200).json(rows);
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    res.status(500).json({ error: 'Ошибка при загрузке базы данных' });
  }
}
