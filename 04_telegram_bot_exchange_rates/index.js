import axios from "axios"
import TelegramBot from "node-telegram-bot-api"
import NodeCache from "node-cache"

//secret data
const token = "6161130240:AAG8Zc1C25fs1gDBBidxPAvFNa_wu-EvcTs"
const apiKey = "eea4a4db653a1dac0a8113dd2c255139"

//city coordinates (Kiev)
const lat = 50.4333
const lon = 30.5167

const bot = new TelegramBot(token, { polling: true })
const myCache = new NodeCache({ useClones: false })

bot.onText(/^\/start|^\/go_back$/, function (msg) {
  const opts = {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [[{ text: "/Weather" }], [{ text: "/Exchange_Rates" }]],
    },
  }
  bot.sendMessage(
    msg.chat.id,
    `@${msg.from.username}, how can I help you?`,
    opts
  )
})

//Weather bot
const getWeather = async (interval) => {
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

bot.onText(/^\/Weather$/, async (msg) => {
  const opts = {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [["/every_3_hours", "/every_6_hours"], ["/go_back"]],
    },
  }
  bot.sendMessage(msg.chat.id, "Choose interval", opts)
})

bot.onText(/^\/every_3_hours$/, async (msg) => {
  const text = await getWeather(3)
  bot.sendMessage(msg.chat.id, text)
})

bot.onText(/^\/every_6_hours$/, async (msg) => {
  const text = await getWeather(6)
  bot.sendMessage(msg.chat.id, text)
})

//Exchange rates bot
const monoRequest = async () => {
  let mono = myCache.get("mono")
  if (!mono) {
    mono = await axios.get("https://api.monobank.ua/bank/currency")
    myCache.set("mono", mono, 70000)
  }
  return mono
}
function representData(obj1, obj2) {
  const { ccy, base_ccy, buy, sale } = obj1
  const { date, rateBuy, rateSell } = obj2
  const data = `
*${ccy}*

  _Privat_
  Buy: ${buy} ${base_ccy}
  Sale: ${sale} ${base_ccy}

  _Mono_
  Buy: ${rateBuy} ${base_ccy}
  Sale: ${rateSell} ${base_ccy}
  Time:${Date(date)}

  All rates are not for cash!`

  return data
}
const getRatesEur = async () => {
  const privat = await axios.get(
    "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11"
  )

  const mono = await monoRequest()
  const monoEur = mono.data.filter(
    (mono) => mono.currencyCodeA === 978 && mono.currencyCodeB === 980
  )
  return representData(privat.data[0], monoEur[0])
}
const getRatesUsd = async () => {
  const privat = await axios.get(
    "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11"
  )
  const mono = await monoRequest()
  const monoUSD = mono.data.filter(
    (mono) => mono.currencyCodeA === 840 && mono.currencyCodeB === 980
  )

  return representData(privat.data[1], monoUSD[0])
}
bot.onText(/^\/Exchange_Rates$/, async (msg) => {
  const opts = {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [["USD", "EUR"], ["/go_back"]],
    },
  }
  bot.sendMessage(msg.chat.id, "Choose currency", opts)
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
  bot.sendMessage(msg.chat.id, text, opts)
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
  bot.sendMessage(msg.chat.id, text, opts)
})
