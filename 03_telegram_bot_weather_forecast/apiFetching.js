import axios from "axios"

export default async function getWeather(interval, lat, lon, apiKey) {
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
