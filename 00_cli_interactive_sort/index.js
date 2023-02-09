function sortAlphabet(arr) {
  let result = []
  for (let index = 0; index < arr.length; index++) {
    //removes numbers
    const element = arr[index]
    if (isNaN(Number(element))) {
      result.push(element)
    }
  }
  result = result.sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase()) //sorts in case-insensitive way
  })
  console.log("\nResult: " + result.join(" "))
}

function sortNumbersToUpper(arr) {
  let result = []
  for (let index = 0; index < arr.length; index++) {
    //removes strings
    const element = arr[index]
    if (!isNaN(Number(element))) {
      result.push(Number(element))
    }
  }
  result = result.sort((a, b) => a - b)
  console.log("\nResult: " + result.join(" "))
}

function sortNumbersToLower(arr) {
  let result = []
  for (let index = 0; index < arr.length; index++) {
    //removes strings
    const element = arr[index]
    if (!isNaN(Number(element))) {
      result.push(Number(element))
    }
  }
  result = result.sort((a, b) => a - b).reverse()
  console.log("\nResult: " + result.join(" "))
}

function sortByNumberOfLetters(arr) {
  let result = []
  for (let index = 0; index < arr.length; index++) {
    //removes numbers
    const element = arr[index]
    if (isNaN(Number(element))) {
      result.push(element)
    }
  }
  result.sort(
    (a, b) =>
      a.length - b.length || // sort by length, if equal then
      a.localeCompare(b)
  ) // sort by dictionary order;

  console.log("\nResult: " + result.join(" "))
}

function uniqueWords(arr) {
  let result = []
  for (let index = 0; index < arr.length; index++) {
    //removes numbers
    const element = arr[index]
    if (isNaN(Number(element))) {
      result.push(element)
    }
  }
  arr = result
  result = []
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i]
    arr.splice(i, 1) //removes element from array
    if (!arr.includes(element)) {
      //pushes element to result if arr has no same element
      result.push(element)
    }
    arr.splice(i, 0, element) //add removed element to original array
  }
  console.log("\nResult: " + result.join(" "))
}

function uniqueElements(arr) {
  let result = []
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i]
    arr.splice(i, 1) //removes element from array
    if (!arr.includes(element)) {
      //pushes element to result if arr has no same element
      result.push(element)
    }
    arr.splice(i, 0, element) //add removed element to original array
  }
  console.log("\nResult: " + result.join(" "))
}

const readline = require("readline")
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function main() {
  rl.question(
    "Hello. Enter 10 words or digits dividing them in spaces: ",
    (answer) => {
      const arr = answer.split(" ")
      arr.length = 10
      rl.question(
        `
1.Sort words alphabeticall\n 
2.Show numbers from lesser to greater\n 
3.Show numbers from bigger to smaller\n 
4.Display words in ascending order by number of letters in the word\n 
5.Show only unique words\n 
6.Display only unique values from the set of words and numbers.\n 
To exit the program enter 'exit', otherwise the program will repeat itself again and again\n
Enter a number of the option you are wanted to choose: `,
        (option) => {
          switch (option) {
            case "1":
              sortAlphabet(arr)
              main()
              break
            case "2":
              sortNumbersToUpper(arr)
              main()
              break
            case "3":
              sortNumbersToLower(arr)
              main()
              break
            case "4":
              sortByNumberOfLetters(arr)
              main()
              break
            case "5":
              uniqueWords(arr)
              main()
              break
            case "6":
              uniqueElements(arr)
              main()
              break
            case "exit":
              rl.close()
              break
            default:
              main()
          }
        }
      )
    }
  )
}

main()
