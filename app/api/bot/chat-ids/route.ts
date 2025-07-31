import { NextResponse } from "next/server";
import { chatStorage } from "../../../lib/chatStorage";

export async function GET() {
  try {
    const chatIds = chatStorage.getChatIds();

    return NextResponse.json({
      success: true,
      chatIds,
      count: chatIds.length,
      message: `Found ${chatIds.length} chat IDs`,
    });
  } catch (error) {
    console.error("Error getting chat IDs:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get chat IDs",
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    chatStorage.clearChatIds();

    return NextResponse.json({
      success: true,
      message: "All chat IDs cleared",
    });
  } catch (error) {
    console.error("Error clearing chat IDs:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to clear chat IDs",
      },
      { status: 500 }
    );
  }
}
