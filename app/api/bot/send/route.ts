import { Bot } from "grammy";
import { NextRequest, NextResponse } from "next/server";

const bot = new Bot(process.env.BOT_TOKEN || "");

export async function POST(req: NextRequest) {
  try {
    const { message, chatId } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // For testing, you can hardcode a chat ID or get it from environment
    const targetChatId = chatId || process.env.CHAT_ID;

    if (!targetChatId) {
      return NextResponse.json(
        {
          error:
            "Chat ID not configured. Set CHAT_ID in environment variables or provide it in the request.",
        },
        { status: 400 }
      );
    }

    await bot.api.sendMessage(targetChatId, message);

    return NextResponse.json({
      message: "Message sent successfully!",
      sentMessage: message,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      {
        error: "Failed to send message",
      },
      { status: 500 }
    );
  }
}
