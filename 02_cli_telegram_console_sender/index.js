const TelegramBot = require("node-telegram-bot-api")
const { Command } = require("commander")

const TOKEN = "6161130240:AAG8Zc1C25fs1gDBBidxPAvFNa_wu-EvcTs" //put your token
const bot = new TelegramBot(TOKEN, { polling: true })
const program = new Command()

const chatId = 496329949 //put your chat id

program
  .command("send-message")
  .alias("m")
  .argument("<message>")
  .description("Send message to Telegram Bot")
  .action(async (msg) => {
    await bot.sendMessage(chatId, msg)
    process.exit()
  })

program
  .command("send-photo")
  .alias("p")
  .argument("<photo>")
  .description("Send photo to Telegram Bot(Provide path)")
  .action(async (msg) => {
    await bot.sendPhoto(chatId, msg)
    process.exit()
  })

program.parse()
