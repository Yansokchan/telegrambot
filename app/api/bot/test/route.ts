import { Bot } from "grammy";
import { NextResponse } from "next/server";

const bot = new Bot(process.env.BOT_TOKEN || "");

export async function GET() {
  try {
    // Test bot connection and get bot info
    const botInfo = await bot.api.getMe();

    return NextResponse.json({
      success: true,
      bot: {
        id: botInfo.id,
        name: botInfo.first_name,
        username: botInfo.username,
        canJoinGroups: botInfo.can_join_groups,
        canReadAllGroupMessages: botInfo.can_read_all_group_messages,
        supportsInlineQueries: botInfo.supports_inline_queries,
      },
      message: "Bot is connected and working!",
    });
  } catch (error) {
    console.error("Bot test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to bot",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
