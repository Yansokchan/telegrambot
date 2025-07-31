// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

const { Bot } = require("grammy");

// This script is for development testing with polling
// In production, you should use webhooks

// Debug: Check if token is loaded
console.log("Bot token loaded:", process.env.BOT_TOKEN ? "YES" : "NO");
if (!process.env.BOT_TOKEN) {
  console.error("❌ BOT_TOKEN not found in environment variables!");
  console.error(
    "Make sure you have created .env.local file with your bot token"
  );
  process.exit(1);
}

const bot = new Bot(process.env.BOT_TOKEN);

// Handle /start command
bot.command("start", async (ctx) => {
  console.log("Bot started by:", ctx.from?.id);
  await ctx.reply("Hello! I'm your test bot. Send me a message or image!");
});

// Handle text messages
bot.on("message:text", async (ctx) => {
  const text = ctx.message.text;
  console.log("Received text:", text, "from:", ctx.from?.id);
  await ctx.reply(`You said: ${text}`);
});

// Handle photo messages
bot.on("message:photo", async (ctx) => {
  const photo = ctx.message.photo[ctx.message.photo.length - 1];
  console.log("Received photo from:", ctx.from?.id);
  await ctx.reply("I received your image! 📸");

  const file = await ctx.api.getFile(photo.file_id);
  await ctx.reply(`File ID: ${photo.file_id}`);
});

// Handle all other message types
bot.on("message", async (ctx) => {
  console.log("Received message from:", ctx.from?.id);
  await ctx.reply("I received your message!");
});

// Start the bot
console.log("Starting bot with polling...");
bot.start();

console.log("Bot is running! Press Ctrl+C to stop.");
