// Simple in-memory storage for chat IDs and usernames
// Note: This will reset when the server restarts, but works for testing

interface UserData {
  chatId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
}

let storedUsers: UserData[] = [];

export const chatStorage = {
  // Add a new user with chat ID and optional username
  addUser: (
    chatId: string,
    username?: string,
    firstName?: string,
    lastName?: string
  ): boolean => {
    const existingUser = storedUsers.find((user) => user.chatId === chatId);

    if (!existingUser) {
      const displayName = username || firstName || `User ${chatId}`;
      const newUser: UserData = {
        chatId,
        username,
        firstName,
        lastName,
        displayName,
      };

      storedUsers.push(newUser);
      console.log(`✅ New user added: ${displayName} (${chatId})`);
      console.log(`📊 Total users: ${storedUsers.length}`);
      return true;
    } else {
      // Update existing user if we have new info
      if (username && !existingUser.username) {
        existingUser.username = username;
        existingUser.displayName = username;
      }
      if (firstName && !existingUser.firstName) {
        existingUser.firstName = firstName;
        if (
          !existingUser.displayName ||
          existingUser.displayName === `User ${chatId}`
        ) {
          existingUser.displayName = firstName;
        }
      }
      return false;
    }
  },

  // Get all stored users
  getUsers: (): UserData[] => {
    return [...storedUsers];
  },

  // Get all stored chat IDs (for backward compatibility)
  getChatIds: (): string[] => {
    return storedUsers.map((user) => user.chatId);
  },

  // Clear all users
  clearUsers: (): void => {
    storedUsers = [];
    console.log("🗑️ All users cleared");
  },

  // Get count
  getCount: (): number => {
    return storedUsers.length;
  },

  // Get user by chat ID
  getUserByChatId: (chatId: string): UserData | undefined => {
    return storedUsers.find((user) => user.chatId === chatId);
  },
};
