import axios from "axios"
import { data } from "./data.js"

const flattenObj = (ob) => {
  let result = {}

  // loop through the object "ob"
  for (const i in ob) {
    // We check the type of the i using
    // typeof() function and recursively
    // call the function again
    if (typeof ob[i] === "object" && !Array.isArray(ob[i])) {
      const temp = flattenObj(ob[i])
      for (const j in temp) {
        // Store temp in result
        result[j] = temp[j]
      }
    }

    // Else store ob[i] in result directly
    else {
      result[i] = ob[i]
    }
  }
  return result
}

async function getJson(arr) {
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

getJson(data)
