
import express from 'express'
import path from 'path'
import { Telegraf } from 'telegraf'
import {message} from 'telegraf/filters'
import { Keyboard } from 'grammy'
import { findRowByRecord, updateRowByRecord } from './google.js'
import { handleGetMessage, isPayoneerLink } from './template.js'
import { telegramApiKey } from './config.js'

const expressApp = express()
expressApp.use(express.static('static'))
expressApp.use(express.json());

const bot = new Telegraf(telegramApiKey);

expressApp.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

bot.launch();

bot.command('start', ctx => {
    const startKeyboard = new Keyboard().text('Реквізити для твого інвойсу');
    ctx.reply('Привіт! Я бот що дасть тобі інформацію щодо інвойсів. Натисни на кнопку аби отримати потрібну інформацію. У разі виникнення питань, пиши нашому HR @svitlanamartyniuk', {
        reply_markup: startKeyboard,
        
    });
  })

bot.on(message('sticker'), (ctx) => ctx.reply('👋'))

bot.hears('Реквізити для твого інвойсу', async (ctx) => {
    const username = ctx.from.username;

    const data = await findRowByRecord(username);

    if (!data) {
        return ctx.reply('Інвойс не готовий, спробуй пізніше');
    }

    const parsedData = JSON.parse(data);
  
    ctx.reply(handleGetMessage(parsedData));
});

bot.on(message('text'), async (ctx) => {
    if (!ctx.message.text) {
        return;
    }
    const isValidLink = isPayoneerLink(ctx.message.text);
    try {
        if (isValidLink) {
            await updateRowByRecord(ctx.from.username, ctx.message.text);
            ctx.reply('Посилання збережено, дякую!');
        } else {
            ctx.reply('Неправильне посилання на Payoneer, спробуй ще раз');
        }
    } catch (err) {
        ctx.reply('Помилка(');
    }
})


