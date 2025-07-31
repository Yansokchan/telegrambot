import { Bot, InputFile } from "grammy";
import { NextRequest, NextResponse } from "next/server";

const bot = new Bot(process.env.BOT_TOKEN || "");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;
    const chatId = formData.get("chatId") as string;

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
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

    // Convert file to buffer
    const buffer = Buffer.from(await image.arrayBuffer());

    // Send photo to Telegram using InputFile
    await bot.api.sendPhoto(targetChatId, new InputFile(buffer, image.name), {
      caption: `Image: ${image.name}`,
    });

    return NextResponse.json({
      message: "Image sent successfully!",
      imageName: image.name,
    });
  } catch (error) {
    console.error("Error sending image:", error);
    return NextResponse.json(
      {
        error: "Failed to send image",
      },
      { status: 500 }
    );
  }
}
