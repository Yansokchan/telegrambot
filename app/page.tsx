"use client";

import BotTester from "./components/BotTester";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl hidden md:block animate-pulse"></div>
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl hidden md:block animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl hidden lg:block animate-pulse"
        style={{ animationDelay: "4s" }}
      ></div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-16">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl md:rounded-3xl mb-6 md:mb-8 shadow-2xl shadow-blue-500/25 animate-bounce">
            <svg
              className="w-8 h-8 md:w-10 md:h-10 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4 md:mb-6 tracking-tight px-4 animate-fade-in">
            Telegram Bot Tester
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8 md:mb-10 px-4 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            A modern interface to test your Telegram bot with text messages and
            images
          </p>

          {/* Bot Link Section */}
          <div
            className="inline-flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-xl mx-4 group animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse group-hover:scale-125 transition-transform"></div>
              <span className="text-gray-200 font-medium text-sm sm:text-base">
                Test Bot:
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <a
                href="https://t.me/test_postman_payments_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-200 font-semibold hover:decoration-blue-400 transition-all duration-300 text-sm sm:text-base group-hover:scale-105"
              >
                @Tshop
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm font-mono bg-gray-800/50 px-2 py-1 rounded-lg">
                /start
              </span>
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </header>

        <BotTester />

        <footer
          className="text-center mt-12 md:mt-20 text-gray-400 px-4 animate-fade-in"
          style={{ animationDelay: "0.9s" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-xs sm:text-sm">
            <span>Built with</span>
            <span className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
              Next.js
            </span>
            <span>and</span>
            <span className="font-semibold text-green-400 hover:text-green-300 transition-colors">
              grammY
            </span>
            <span>framework</span>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
