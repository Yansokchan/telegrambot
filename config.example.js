// Example configuration file
// Copy this to config.js and fill in your values

module.exports = {
  // Your Telegram bot token from @BotFather
  BOT_TOKEN: "7582676658:AAFw1oxdIlcXYav6FYh6GjQ71CAqX_7sDpk",

  // Your chat ID for testing (get it from @userinfobot)
  CHAT_ID: "1455761841",

  // Webhook URL for production (optional)
  WEBHOOK_URL: "https://your-domain.com/api/bot",

  // Development mode (uses polling instead of webhooks)
  DEV_MODE: true,

  // Bot commands
  COMMANDS: {
    start: "Start the bot",
    help: "Show help information",
    test: "Test the bot functionality",
  },
};
