import axios from "axios"
import { data } from "./data.js"

const flattenObj = (ob) => {//flat object to find 'isDone' param
  let result = {}
  for (const i in ob) {
    if (typeof ob[i] === "object" && !Array.isArray(ob[i])) {
      const temp = flattenObj(ob[i])
      for (const j in temp) {
        result[j] = temp[j]
      }
    }
    else {
      result[i] = ob[i]
    }
  }
  return result
}

async function checkAllJson(arr) {
  let trueValues = 0
  let falseValues = 0
  let errorCounter = 0
  for (let index = 0; index < arr.length; index++) {
    try {
      let data = await axios.get(arr[index])
      data = flattenObj(data.data)
      if (data.isDone) {
        console.log(`[Success] ${arr[index]}: isDone: - True`)
        trueValues++
      } else if (!data.isDone) {
        console.log(`[Success] ${arr[index]}: isDone: - False`)
        falseValues++
      }
    } catch (error) {
      if (error && errorCounter < 3) {
        index--
        errorCounter++
      } else if (error && errorCounter == 3) {
        errorCounter = 0
        console.log(`[Fail] ${arr[index]}: The endpoint is unavailable`)
      }
    }
  }
  console.log(
    `Found True values: ${trueValues},\nFound False values: ${falseValues}`
  )
}

checkAllJson(data)
