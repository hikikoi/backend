const express = require("express");
const app = express();
const { PORT, openaiKey } = require("./src/config/config");
const path = require("path");
app.use(express.static("static"));
app.use(express.json());
const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const { OpenAIApi } = require("openai");
const axios = require('axios');
const cron = require('node-cron');
require('dotenv').config();

const openai = new OpenAIApi(openaiKey);

const bot = new Telegraf(process.env.BOT_TOKEN);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

let chat_id;

bot.command("start", (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Welcome to Kaiwaki ! \n\n I'm here to assist you with any questions or topics you have in mind. Whether you need information, advice, or simply want to have a friendly chat, I'm at your service. Feel free to ask me anything, and let's start our conversation on a bright note!`,
    {}
  );
  chat_id = ctx.chat.id
  console.log(chat_id)
});


async function getWeatherSummary() {
  const apiKey = process.env.WEATHER_KEY;
  const city = 'Tashkent';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  try {
    const response = await axios.get(url);
    const weatherData = response.data;
    console.log(response);
    const weatherSummary = `Weather in ${city}:\nTemperature: ${weatherData.main.temp}°C\nDescription: ${weatherData.weather[0].description}`;

    return weatherSummary;
  } catch (error) {
    console.error('Ошибка при получении сводки погоды:', error);
    return 'Произошла ошибка при получении сводки погоды';
  }
}

cron.schedule('35 9 * * *', async () => {
  const weatherSummary = await getWeatherSummary();
  bot.telegram.sendMessage(chat_id, weatherSummary);
  bot.telegram.sendMessage(2137653637, weatherSummary);
  console.log(weatherSummary);
}, {
  timezone: 'Asia/Tashkent'
});

bot.command('weather', async (ctx) => {
  const weatherSummary = await getWeatherSummary();
  bot.telegram.sendMessage(ctx.chat.id, weatherSummary, {});
})

bot.on(message('text'), async (ctx) => {
  const userInput = ctx.message.text;

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: userInput + '.\n',
    temperature: 0.8,
    max_tokens: 4000,
  });

  const basePromptOutput = baseCompletion.data.choices.pop().text.trim();

  await ctx.reply(basePromptOutput);
});




bot.launch();

app.listen(PORT, () => {
  console.log("App is listening on port", PORT);
});
