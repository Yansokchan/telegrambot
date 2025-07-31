"use client";

import { useState } from "react";

export default function BotTester() {
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [chatIds, setChatIds] = useState("");
  const [sendToAll, setSendToAll] = useState(false);
  const [storedChatIds, setStoredChatIds] = useState<string[]>([]);
  const [showStoredIds, setShowStoredIds] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/bot/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          chatIds: sendToAll
            ? chatIds
                .split(",")
                .map((id) => id.trim())
                .filter((id) => id)
            : showStoredIds && storedChatIds.length > 0
            ? storedChatIds
            : undefined,
        }),
      });

      const data = await res.json();
      setResponse(data.message || "Message sent!");
    } catch (error) {
      setResponse("Error sending message");
    } finally {
      setIsLoading(false);
    }
  };

  const sendImage = async () => {
    if (!imageFile) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      if (sendToAll && chatIds) {
        formData.append("chatIds", chatIds);
      } else if (showStoredIds && storedChatIds.length > 0) {
        formData.append("chatIds", storedChatIds.join(","));
      }

      const res = await fetch("/api/bot/send-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResponse(data.message || "Image sent!");
    } catch (error) {
      setResponse("Error sending image");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStoredChatIds = async () => {
    try {
      const res = await fetch("/api/bot/chat-ids");
      const data = await res.json();
      if (data.success) {
        setStoredChatIds(data.chatIds);
        setShowStoredIds(true);
      }
    } catch (error) {
      console.error("Error loading chat IDs:", error);
    }
  };

  const clearStoredChatIds = async () => {
    if (!confirm("Are you sure you want to clear all stored chat IDs?")) return;

    try {
      const res = await fetch("/api/bot/chat-ids", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setStoredChatIds([]);
        setShowStoredIds(false);
        setResponse("All chat IDs cleared");
      }
    } catch (error) {
      setResponse("Error clearing chat IDs");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Telegram Bot Tester
      </h2>

      {/* Stored Chat IDs Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-700">
            Stored Chat IDs
          </h3>
          <div className="flex gap-2">
            <button
              onClick={loadStoredChatIds}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              Load Stored IDs
            </button>
            <button
              onClick={clearStoredChatIds}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
            >
              Clear All
            </button>
          </div>
        </div>

        {showStoredIds && (
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">
              Found {storedChatIds.length} stored chat IDs:
            </div>
            <textarea
              value={storedChatIds.join(", ")}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              These are automatically collected when users send /start to your
              bot
            </p>
          </div>
        )}
      </div>

      {/* Multiple Chat IDs Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            id="sendToAll"
            checked={sendToAll}
            onChange={(e) => setSendToAll(e.target.checked)}
            className="rounded"
          />
          <label
            htmlFor="sendToAll"
            className="text-sm font-medium text-gray-700"
          >
            Send to multiple chat IDs
          </label>
        </div>

        {sendToAll && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chat IDs (comma-separated)
            </label>
            <textarea
              value={chatIds}
              onChange={(e) => setChatIds(e.target.value)}
              placeholder="123456789, 987654321, 555666777"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple chat IDs with commas
            </p>
          </div>
        )}
      </div>

      {/* Text Message Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Send Text Message
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !message.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Send Image</h3>
        <div className="space-y-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {imageFile && (
            <div className="text-sm text-gray-600">
              Selected: {imageFile.name}
            </div>
          )}
          <button
            onClick={sendImage}
            disabled={isLoading || !imageFile}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Image
          </button>
        </div>
      </div>

      {/* Response Section */}
      {response && (
        <div className="p-3 bg-gray-100 rounded-md">
          <h4 className="font-semibold text-gray-700 mb-1">Response:</h4>
          <p className="text-gray-600">{response}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h4 className="font-semibold text-blue-800 mb-2">Instructions:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Set your bot token in the environment variables</li>
          <li>• Start your bot with /start command in Telegram</li>
          <li>• Chat IDs are automatically collected when users send /start</li>
          <li>• Use "Load Stored IDs" to see all collected chat IDs</li>
          <li>• Send to all stored users or specify custom chat IDs</li>
          <li>• Check your Telegram chat for bot responses</li>
        </ul>
      </div>
    </div>
  );
}
