const fs = require("fs")
const axios = require("axios")

function formating(arr) {
  const formatedArr = []
  while (arr.length > 0) {
    const userId = arr[0].user._id
    const name = arr[0].user.name
    const vacations = [{ startDate: arr[0].startDate, endDate: arr[0].endDate }]
    arr.shift()
    let i = arr.findIndex((obj) => obj.user._id === userId)
    while (i !== -1) {
      vacations.push({ startDate: arr[i].startDate, endDate: arr[i].endDate })
      arr.splice(i, 1)
      i = arr.findIndex((obj) => obj.user._id === userId)
    }
    formatedArr.push({
      userId: userId,
      userName: name,
      vacations: vacations,
    })
  }

  return formatedArr
}

async function main() {
  const res = await axios.get("https://jsonbase.com/sls-team/vacations")
  const data = res.data

  fs.writeFile(
    "formatedJSON.json",
    JSON.stringify(formating(data)),
    function (err) {
      if (err) throw err
      console.log("Saved!")
    }
  )
}

main()
