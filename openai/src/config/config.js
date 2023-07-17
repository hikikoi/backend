const dotenv = require('dotenv');
const {Configuration} = require('openai')
dotenv.config()

const PORT = process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000;
const openaiKey = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})
const telegramToken = process.env.BOT_TOKEN;


module.exports={
    PORT,
    openaiKey,
    telegramToken
}