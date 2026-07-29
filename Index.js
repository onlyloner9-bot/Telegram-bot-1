require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

const BAD_WORDS = [
  "badword1",
  "badword2",
  "badword3",
];

const GROUP_MENTIONS = [
  "@everyone",
  "@all",
  "@here",
];

// /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🤖 Bot Online!\n\n/start\n/help\n/ping"
  );
});

// /help
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "📋 Features:\n\n✅ Auto Reply\n✅ Welcome\n✅ Anti Link\n✅ Anti Bad Word\n✅ Anti Group Mention"
  );
});

// /ping
bot.onText(/\/ping/, (msg) => {
  bot.sendMessage(msg.chat.id, "🏓 Pong!");
});

// Welcome new members
bot.on("new_chat_members", (msg) => {
  msg.new_chat_members.forEach((member) => {
    bot.sendMessage(
      msg.chat.id,
      `👋 Welcome ${member.first_name}!`
    );
  });
});

// Messages
bot.on("message", async (msg) => {
  if (!msg.text) return;

  if (msg.text.startsWith("/")) return;

  const text = msg.text;

  const linkRegex =
    /(https?:\/\/\S+|t\.me\/\S+|telegram\.me\/\S+)/i;

  if (linkRegex.test(text)) {
    try {
      await bot.deleteMessage(msg.chat.id, msg.message_id);
      return bot.sendMessage(
        msg.chat.id,
        `⚠️ ${msg.from.first_name}, links are not allowed.`
      );
    } catch (err) {}
  }

  for (const word of BAD_WORDS) {
    if (text.toLowerCase().includes(word.toLowerCase())) {
      try {
        await bot.deleteMessage(msg.chat.id, msg.message_id);
        return bot.sendMessage(
          msg.chat.id,
          `⚠️ ${msg.from.first_name}, bad words are not allowed.`
        );
      } catch (err) {}
    }
  }

  for (const mention of GROUP_MENTIONS) {
    if (text.toLowerCase().includes(mention.toLowerCase())) {
      try {
        await bot.deleteMessage(msg.chat.id, msg.message_id);
        return bot.sendMessage(
          msg.chat.id,
          `⚠️ ${msg.from.first_name}, mass mentions are not allowed.`
        );
      } catch (err) {}
    }
  }

  bot.sendMessage(msg.chat.id, `📨 You said:\n${text}`);
});

console.log("✅ Bot Running...");
