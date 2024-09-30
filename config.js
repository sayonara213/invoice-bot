import { google } from "googleapis";
import config from './config.json' assert { type: "json" };

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const auth = new google.auth.GoogleAuth({
    credentials: config,
    scopes: SCOPES,
  });

export const sheet = google.sheets({ version: 'v4', auth});
 
export const spreadsheetId = process.env.SPREADSHEET_ID;
export const telegramApiKey = process.env.TELEGRAM_API_KEY;