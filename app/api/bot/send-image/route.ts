import { Bot, InputFile } from "grammy";
import { NextRequest, NextResponse } from "next/server";

const bot = new Bot(process.env.BOT_TOKEN || "");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;
    const chatId = formData.get("chatId") as string;
    const chatIdsString = formData.get("chatIds") as string;

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    let targetChatIds: string[] = [];

    // Handle multiple chat IDs
    if (chatIdsString) {
      targetChatIds = chatIdsString
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id);
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

    // Convert file to buffer
    const buffer = Buffer.from(await image.arrayBuffer());
    const inputFile = new InputFile(buffer, image.name);

    // Send photo to all chat IDs
    const results = await Promise.allSettled(
      targetChatIds.map((chatId) =>
        bot.api.sendPhoto(chatId, inputFile, {
          caption: `Image: ${image.name}`,
        })
      )
    );

    const successful = results.filter(
      (result) => result.status === "fulfilled"
    ).length;
    const failed = results.filter(
      (result) => result.status === "rejected"
    ).length;

    return NextResponse.json({
      message: `Image sent to ${successful} recipients${
        failed > 0 ? `, ${failed} failed` : ""
      }`,
      imageName: image.name,
      totalRecipients: targetChatIds.length,
      successful,
      failed,
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
