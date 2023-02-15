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

async function getWeather(interval) {
  const forecast = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
  )
  let len
  let step
  switch (interval) {
    case 3:
      len = 7
      step = 1
      break
    case 6:
      len = 14
      step = 2
      break
    default:
      len = 7
      step = 1
      break
  }
  const data = forecast.data.list
  let text = ""
  for (let index = 0; index < len; index += step) {
    text += `
      
    Date: ${data[index].dt_txt}

    Weather: ${data[index].weather[0].main},
    Temperature: ${Math.floor(data[index].main.temp - 273.15)}°C,
    Feels like: ${Math.floor(data[index].main.feels_like - 273.15)}°C,
    Wind speed: ${data[index].wind.speed} m/s
    `
  }
  return text
}

bot.onText(/Forecast in Kiev/, async (msg) => {
  const opts = {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [["At intervals of 3 hours", "At intervals of 6 hours"]],
    },
  }
  bot.sendMessage(msg.chat.id, "Choose interval", opts)
})

bot.onText(/At intervals of 3 hours/, async (msg) => {
  const text = await getWeather(3)
  bot.sendMessage(msg.chat.id, text)
})

bot.onText(/At intervals of 6 hours/, async (msg) => {
  const text = await getWeather(6)
  bot.sendMessage(msg.chat.id, text)
})
