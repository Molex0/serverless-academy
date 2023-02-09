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
const getWeather = async () => {
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

bot.onText(/^\/Weather$/, async (msg) => {
  const opts = {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [["/every_3_hours", "/every_6_hours"], ["/stop"], ["/go_back"]],
    },
  }
  const text =
    (await getWeather()) +
    "\n\nYou can get info about weather every 3 or 6 hours. Choose what you want"
  bot.sendMessage(msg.chat.id, text, opts)
})

bot.onText(/^\/every_3_hours$/, (msg) => {
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

bot.onText(/^\/every_6_hours$/, (msg) => {
  bot.sendMessage(
    msg.from.id,
    "Forecast will update every 6 hours. Send /stop if you do not want"
  )
  const interval = setInterval(async () => {
    const text =
      (await getWeather()) +
      "\n\nAfter 6 hours forecast will be updated. Send /stop if you do not want"
    bot.sendMessage(msg.chat.id, text)
  }, 21600000) //6 hours
  bot.on("message", (msg) => clearInterval(interval))
})

bot.onText(/^\/stop$/, (msg) => {})

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
