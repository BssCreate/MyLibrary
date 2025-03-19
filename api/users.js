import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async function handler(req, res) {
    try {
        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
        const auth = new JWT({
            email: process.env.GOOGLE_CLIENT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        await doc.useServiceAccountAuth(auth);
        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0]; // Первый лист
        const rows = await sheet.getRows(); // Все строки

        let users = {};
        rows.forEach(row => {
            users[row['Номер телефона'].replace(/\D/g, '')] = row['Пароль'];
        });

        res.status(200).json(users);
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).json({ error: 'Ошибка загрузки данных' });
    }
}
