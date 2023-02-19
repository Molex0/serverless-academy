const fs = require("fs")

const uniqueObjectData = {} //contain word and number of files where it is
const data = [] //contain all words from file

fs.readdirSync("./files").forEach((file) => {
  const currentFile = fs.readFileSync("./files/" + file, "utf8")
  const uniqueDataFromFile = [...new Set(currentFile.split("\n"))]
  data.push(currentFile.split("\n"))

  uniqueDataFromFile.forEach((element) => {
    uniqueObjectData[element]
      ? uniqueObjectData[element]++
      : (uniqueObjectData[element] = 1)
  })
})

function uniqueValues() {
  return [...new Set(data.flat())].length
}

function existedInAllFiles() {
  let counter = 0
  for (const key in uniqueObjectData) {
    if (uniqueObjectData[key] === 20) {
      counter++
    }
  }
  return counter
}

function existInAtleastTen() {
  let counter = 0
  for (const key in uniqueObjectData) {
    if (uniqueObjectData[key] >= 10) {
      counter++
    }
  }
  return counter
}

console.time("uniqueValues")
console.log(uniqueValues())
console.timeEnd("uniqueValues")

console.time("existedInAllFiles")
console.log(existedInAllFiles())
console.timeEnd("existedInAllFiles")

console.time("existInAtleastTen")
console.log(existInAtleastTen())
console.timeEnd("existInAtleastTen")
