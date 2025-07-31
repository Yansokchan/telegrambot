# Telegram Bot Tester

A Next.js application for testing Telegram bots using the grammY framework. This app provides a simple UI to send text messages and images to your Telegram bot.

## Features

- 📝 Send text messages to your Telegram bot
- 🖼️ Upload and send images to your Telegram bot
- 🎨 Modern, responsive UI built with Tailwind CSS
- ⚡ Real-time feedback and error handling
- 🔧 Easy configuration with environment variables

## Setup Instructions

### 1. Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the bot token provided by BotFather

### 2. Get Your Chat ID

**Method 1: Using @userinfobot**

1. Search for [@userinfobot](https://t.me/userinfobot) on Telegram
2. Send any message to get your chat ID

**Method 2: Using webhook logs**

1. Start your bot and send a message
2. Check the console logs for the chat ID

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Telegram Bot Configuration
BOT_TOKEN=your_bot_token_here
CHAT_ID=your_chat_id_here
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

1. **Start your bot**: Send `/start` to your bot on Telegram
2. **Send text messages**: Type a message in the text input and click "Send"
3. **Send images**: Select an image file and click "Send Image"
4. **Check responses**: View bot responses in your Telegram chat

## API Endpoints

- `POST /api/bot` - Webhook endpoint for receiving messages from Telegram
- `POST /api/bot/send` - Send text messages to your bot
- `POST /api/bot/send-image` - Send images to your bot

## Development

### Project Structure

```
telegram-bot/
├── app/
│   ├── api/bot/
│   │   ├── route.ts          # Main bot webhook handler
│   │   ├── send/route.ts     # Send text messages
│   │   └── send-image/route.ts # Send images
│   ├── components/
│   │   └── BotTester.tsx     # Main UI component
│   └── page.tsx              # Home page
├── .env.local.example        # Environment variables template
└── README.md                 # This file
```

### Technologies Used

- **Next.js 15** - React framework
- **grammY** - Telegram Bot API framework
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

## Troubleshooting

### Common Issues

1. **"Bot token not configured"**

   - Make sure you've set the `BOT_TOKEN` in your `.env.local` file

2. **"Chat ID not configured"**

   - Set the `CHAT_ID` in your `.env.local` file or provide it in the UI

3. **Messages not being sent**

   - Verify your bot token is correct
   - Make sure you've started the bot with `/start` command
   - Check that the chat ID is correct

4. **Images not uploading**
   - Ensure the image file is valid
   - Check file size limits (Telegram has a 50MB limit)

### Getting Help

- Check the [grammY documentation](https://grammy.dev/)
- Review the [Telegram Bot API documentation](https://core.telegram.org/bots/api)
- Check the console logs for detailed error messages

## License

MIT License - feel free to use this project for your own Telegram bot development!
