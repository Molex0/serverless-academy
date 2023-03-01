import TelegramBot from "node-telegram-bot-api"

import { getWeather, getRatesEur, getRatesUsd } from "./apiFetching.js"

//secret data
const token = "6161130240:AAG8Zc1C25fs1gDBBidxPAvFNa_wu-EvcTs"
const apiKey = "eea4a4db653a1dac0a8113dd2c255139"

//city coordinates (Kiev)
const lat = 50.4333
const lon = 30.5167

const bot = new TelegramBot(token, { polling: true })

bot.onText(/^\/start|^\/go_back$/, async function (msg) {
  const opts = {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [[{ text: "/Weather" }], [{ text: "/Exchange_Rates" }]],
    },
  }
  await bot.sendMessage(
    msg.chat.id,
    `@${msg.from.username}, how can I help you?`,
    opts
  )
})

//Weather bot

bot.onText(/^\/Weather$/, async (msg) => {
  const opts = {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [["/every_3_hours", "/every_6_hours"], ["/go_back"]],
    },
  }
  await bot.sendMessage(msg.chat.id, "Choose interval", opts)
})

bot.onText(/^\/every_3_hours$/, async (msg) => {
  const text = await getWeather(3, lat, lon, apiKey)
  await bot.sendMessage(msg.chat.id, text)
})

bot.onText(/^\/every_6_hours$/, async (msg) => {
  const text = await getWeather(6, lat, lon, apiKey)
  await bot.sendMessage(msg.chat.id, text)
})

//Exchange rates bot

bot.onText(/^\/Exchange_Rates$/, async (msg) => {
  const opts = {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [["USD", "EUR"], ["/go_back"]],
    },
  }
  await bot.sendMessage(msg.chat.id, "Choose currency", opts)
})

bot.onText(/EUR/, async (msg) => {
  const opts = {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [["USD", "EUR"], ["/go_back"]],
    },
    parse_mode: "Markdown",
  }
  const text = await getRatesEur()
  await bot.sendMessage(msg.chat.id, text, opts)
})

bot.onText(/USD/, async (msg) => {
  const opts = {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [["USD", "EUR"], ["/go_back"]],
    },
    parse_mode: "Markdown",
  }
  const text = await getRatesUsd()
  await bot.sendMessage(msg.chat.id, text, opts)
})
