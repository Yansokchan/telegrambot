import { Bot, webhookCallback } from "grammy";
import { NextRequest, NextResponse } from "next/server";

// Initialize the bot with your token
const bot = new Bot(process.env.BOT_TOKEN || "");

// Handle /start command
bot.command("start", async (ctx) => {
  await ctx.reply("Hello! I'm your test bot. Send me a message or image!");
});

// Handle text messages
bot.on("message:text", async (ctx) => {
  const text = ctx.message.text;
  await ctx.reply(`You said: ${text}`);
});

// Handle photo messages
bot.on("message:photo", async (ctx) => {
  const photo = ctx.message.photo[ctx.message.photo.length - 1]; // Get the largest photo
  await ctx.reply("I received your image! 📸");

  // You can also get the file info
  const file = await ctx.api.getFile(photo.file_id);
  await ctx.reply(`File ID: ${photo.file_id}`);
});

// Handle all other message types
bot.on("message", async (ctx) => {
  await ctx.reply("I received your message!");
});

// Webhook handler for production
export async function POST(req: NextRequest) {
  try {
    const handler = webhookCallback(bot, "std/http");
    return await handler(req);
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

// For development, you can also use polling
export async function GET() {
  return NextResponse.json({ message: "Bot is running" });
}
