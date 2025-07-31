// Simple in-memory storage for chat IDs
// Note: This will reset when the server restarts, but works for testing

let storedChatIds: string[] = [];

export const chatStorage = {
  // Add a new chat ID
  addChatId: (chatId: string): boolean => {
    if (!storedChatIds.includes(chatId)) {
      storedChatIds.push(chatId);
      console.log(`✅ New chat ID added: ${chatId}`);
      console.log(`📊 Total chat IDs: ${storedChatIds.length}`);
      return true;
    }
    return false;
  },

  // Get all stored chat IDs
  getChatIds: (): string[] => {
    return [...storedChatIds];
  },

  // Clear all chat IDs
  clearChatIds: (): void => {
    storedChatIds = [];
    console.log("🗑️ All chat IDs cleared");
  },

  // Get count
  getCount: (): number => {
    return storedChatIds.length;
  },
};
