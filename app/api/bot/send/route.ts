import { Bot } from "grammy";
import { NextRequest, NextResponse } from "next/server";

const bot = new Bot(process.env.BOT_TOKEN || "");

export async function POST(req: NextRequest) {
  try {
    const { message, chatId, chatIds } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    let targetChatIds: string[] = [];

    // Handle multiple chat IDs
    if (chatIds && Array.isArray(chatIds) && chatIds.length > 0) {
      targetChatIds = chatIds;
    } else if (chatId) {
      targetChatIds = [chatId];
    } else if (process.env.CHAT_ID) {
      targetChatIds = [process.env.CHAT_ID];
    }

    if (targetChatIds.length === 0) {
      return NextResponse.json(
        {
          error:
            "Chat ID not configured. Set CHAT_ID in environment variables or provide chatIds in the request.",
        },
        { status: 400 }
      );
    }

    // Send message to all chat IDs
    const results = await Promise.allSettled(
      targetChatIds.map((chatId) => bot.api.sendMessage(chatId, message))
    );

    const successful = results.filter(
      (result) => result.status === "fulfilled"
    ).length;
    const failed = results.filter(
      (result) => result.status === "rejected"
    ).length;

    return NextResponse.json({
      message: `Message sent to ${successful} recipients${
        failed > 0 ? `, ${failed} failed` : ""
      }`,
      sentMessage: message,
      totalRecipients: targetChatIds.length,
      successful,
      failed,
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
