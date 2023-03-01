import TelegramBot from "node-telegram-bot-api"
import getWeather from "./apiFetching.js"

//secret data
const token = "6161130240:AAG8Zc1C25fs1gDBBidxPAvFNa_wu-EvcTs"
const apiKey = "eea4a4db653a1dac0a8113dd2c255139"

//city coordinates (Kiev)
const lat = 50.4333
const lon = 30.5167

const bot = new TelegramBot(token, { polling: true })

bot.onText(/^\/start$/, function (msg) {
  const opts = {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [[{ text: "Forecast in Kiev" }]],
    },
  }
  bot.sendMessage(
    msg.chat.id,
    `Hi, @${msg.from.username}. How can I help you?`,
    opts
  )
})

bot.onText(/Forecast in Kiev/, async (msg) => {
  const opts = {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [["At intervals of 3 hours", "At intervals of 6 hours"]],
    },
  }
  await bot.sendMessage(msg.chat.id, "Choose interval", opts)
})

bot.onText(/At intervals of 3 hours/, async (msg) => {
  const text = await getWeather(3, lat, lon, apiKey)
  await bot.sendMessage(msg.chat.id, text)
})

bot.onText(/At intervals of 6 hours/, async (msg) => {
  const text = await getWeather(6, lat, lon, apiKey)
  await bot.sendMessage(msg.chat.id, text)
})
