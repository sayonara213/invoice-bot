const { google } = require("googleapis");
const config = require("./config.json");
require("dotenv").config();
console.log(process.env);

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const auth = new google.auth.GoogleAuth({
  credentials: config,
  scopes: SCOPES,
});

const sheet = google.sheets({ version: "v4", auth });

const spreadsheetId = process.env.SPREADSHEET_ID;
const telegramApiKey = process.env.TELEGRAM_API_KEY;

module.exports = {
  sheet,
  spreadsheetId,
  telegramApiKey,
};
