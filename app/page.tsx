import BotTester from "./components/BotTester";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Telegram Bot Tester
          </h1>
          <p className="text-gray-600">
            Test your Telegram bot with text messages and images
          </p>
        </header>

        <BotTester />

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Built with Next.js and grammY framework</p>
        </footer>
      </div>
    </div>
  );
}
