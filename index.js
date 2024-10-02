const express = require("express");
const path = require("path");
require("dotenv").config();
const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const { Keyboard } = require("grammy");
const { findRowByRecord, updateRowByRecord } = require("./google.js");
const { handleGetMessage, isPayoneerLink } = require("./template.js");
const { telegramApiKey } = require("./config.js");

const expressApp = express();
expressApp.use(express.static("static"));
expressApp.use(express.json());

const bot = new Telegraf(telegramApiKey);

expressApp.listen(3000, () => {
  console.log(`Example app listening on port ${3000}`);
});

expressApp.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

bot.launch();

bot.command("start", (ctx) => {
  const startKeyboard = new Keyboard().text("Реквізити для твого інвойсу");
  ctx.reply(
    "Привіт! Я бот що дасть тобі інформацію щодо інвойсів. Натисни на кнопку аби отримати потрібну інформацію. У разі виникнення питань, пиши нашому HR @svitlanamartyniuk",
    {
      reply_markup: startKeyboard,
    }
  );
});

bot.on(message("sticker"), (ctx) => ctx.reply("👋"));

bot.hears("Реквізити для твого інвойсу", async (ctx) => {
  const username = ctx.from.username;

  const data = await findRowByRecord(username);

  if (data === "no-user") {
    return ctx.reply(
      "Ти не зареєстрований у нашій таблиці, звернись до HR @svitlanamartyniuk"
    );
  }

  if (!data) {
    return ctx.reply("Інвойс не готовий, спробуй пізніше");
  }

  const parsedData = JSON.parse(data);

  ctx.reply(handleGetMessage(parsedData));
});

bot.on(message("text"), async (ctx) => {
  if (!ctx.message.text) {
    return;
  }
  const isValidLink = isPayoneerLink(ctx.message.text);
  try {
    if (isValidLink) {
      await updateRowByRecord(ctx.from.username, ctx.message.text);
      ctx.reply("Посилання збережено, дякую!");
    } else {
      ctx.reply("Неправильне посилання на Payoneer, спробуй ще раз");
    }
  } catch (err) {
    ctx.reply("Помилка(");
  }
});
