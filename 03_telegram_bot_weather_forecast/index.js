import axios from "axios"
import TelegramBot from "node-telegram-bot-api"

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

async function getWeather() {
  const data = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
  )
  const { weather, main, wind, name } = data.data
  const text = `
    ${name} forecast:\n
    Weather: ${weather[0].main},
    Temperature: ${Math.floor(main.temp - 273.15)}°C,
    Feels like: ${Math.floor(main.feels_like - 273.15)}°C,
    Wind speed: ${wind.speed} m/s`

  return text
}

bot.onText(/Forecast in Kiev/, async (msg) => {
  const opts = {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [
        ["At intervals of 3 hours", "At intervals of 6 hours"],
        ["/stop"],
      ],
    },
  }
  const text =
    (await getWeather()) +
    "\n\nYou can get info about weather every 3 or 6 hours. Choose what you want"
  bot.sendMessage(msg.chat.id, text, opts)
})

bot.onText(/At intervals of 3 hours/, (msg) => {
  bot.sendMessage(
    msg.from.id,
    "Forecast will update every 3 hours. Send /stop if you do not want"
  )
  const interval = setInterval(async () => {
    const text =
      (await getWeather()) + "\n\nAfter 3 hours forecast will be updated"
    bot.sendMessage(msg.chat.id, text)
  }, 10800000) //3 hours
  bot.on("message", (msg) => clearInterval(interval))
})

bot.onText(/At intervals of 6 hours/, (msg) => {
  bot.sendMessage(msg.from.id, "Forecast will update every 6 hours")
  const interval = setInterval(async () => {
    const text =
      (await getWeather()) +
      "\n\nAfter 6 hours forecast will be updated. Send /stop if you do not want"
    bot.sendMessage(msg.chat.id, text)
  }, 21600000) //6 hours
  bot.on("message", (msg) => clearInterval(interval))
})

bot.onText(/^\/stop$/, (msg) => {})
