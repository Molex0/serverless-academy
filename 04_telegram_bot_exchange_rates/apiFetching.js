import axios from "axios"
import NodeCache from "node-cache"

const myCache = new NodeCache({ useClones: false })

//-----------------------weather app-----------------------//

async function getWeather(interval, lat, lon, apiKey) {
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

//-----------------------rates app-----------------------//

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

async function monoRequest() {
  let mono = myCache.get("mono")
  if (!mono) {
    mono = await axios.get("https://api.monobank.ua/bank/currency")
    myCache.set("mono", mono, 70000)
  }
  return mono
}

async function getRatesEur() {
  const privat = await axios.get(
    "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11"
  )

  const mono = await monoRequest()
  const monoEur = mono.data.filter(
    (mono) => mono.currencyCodeA === 978 && mono.currencyCodeB === 980
  )
  return representData(privat.data[0], monoEur[0])
}

async function getRatesUsd() {
  const privat = await axios.get(
    "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11"
  )
  const mono = await monoRequest()
  const monoUSD = mono.data.filter(
    (mono) => mono.currencyCodeA === 840 && mono.currencyCodeB === 980
  )

  return representData(privat.data[1], monoUSD[0])
}

export { getWeather, getRatesEur, getRatesUsd }
