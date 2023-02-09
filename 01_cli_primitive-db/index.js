import inquirer from "inquirer"
import fs from "fs/promises"

const questionName = {
  type: "input",
  name: "user",
  message: "Enter the user's name. To cancel press ENTER: ",
}

const questionsUser = [
  {
    type: "list",
    name: "gender",
    message: "Choose your gender",
    choices: ["male", "female"],
  },
  {
    type: "number",
    name: "age",
    message: "Enter your age",
    validate: (answer) => {
      if (isNaN(Number(answer))) {
        return "Please enter the name"
      }
      return true
    },
  },
]

const questionsDB = [
  {
    type: "confirm",
    name: "dbAccess",
    message: "Would you to search values in DB?",
    default: false,
  },
  {
    type: "input",
    name: "searchedUser",
    message: "Enter the user's name you want to find in DB: ",
    validate: (answer) => {
      if (answer.trim() == false) {
        return "Please enter the name"
      }
      return true
    },
  },
]

const addUser = (user) => {
  inquirer.prompt(questionsUser).then(async ({ gender, age }) => {
    const db = JSON.parse(await fs.readFile("./test.txt", { encoding: "utf8" }))
    db.push({ user, gender, age })
    const newDB = JSON.stringify(db)
    await fs.writeFile("./test.txt", newDB)
    start()
  })
}

const showDb = () => {
  inquirer.prompt(questionsDB[0]).then(async ({ dbAccess }) => {
    if (dbAccess) {
      console.log(
        JSON.parse(await fs.readFile("./test.txt", { encoding: "utf8" }))
      )
      findUser()
    }
    return
  })
}

const findUser = () => {
  inquirer.prompt(questionsDB[1]).then(async ({ searchedUser }) => {
    try {
      const db = JSON.parse(
        await fs.readFile("./test.txt", { encoding: "utf8" })
      )
      const userInfo = db.filter(
        (base) => base.user.toLowerCase() === searchedUser.toLowerCase()
      )
      console.log(userInfo)
    } catch (error) {
      console.log(error)
    }
    start()
  })
}

const start = () => {
  inquirer.prompt(questionName).then(({ user }) => {
    if (user.toLowerCase() !== "") {
      addUser(user)
    } else {
      showDb()
    }
  })
}

start()
