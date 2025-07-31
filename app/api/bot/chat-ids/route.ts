import { NextResponse } from "next/server";
import { chatStorage } from "../../../lib/chatStorage";

export async function GET() {
  try {
    const users = chatStorage.getUsers();
    const chatIds = chatStorage.getChatIds();

    return NextResponse.json({
      success: true,
      users,
      chatIds, // For backward compatibility
      count: users.length,
      message: `Found ${users.length} users`,
    });
  } catch (error) {
    console.error("Error getting users:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get users",
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    chatStorage.clearUsers();

    return NextResponse.json({
      success: true,
      message: "All users cleared",
    });
  } catch (error) {
    console.error("Error clearing users:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to clear users",
      },
      { status: 500 }
    );
  }
}
