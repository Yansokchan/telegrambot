"use client";

import { useState } from "react";

export default function BotTester() {
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [chatIds, setChatIds] = useState("");
  const [sendToAll, setSendToAll] = useState(false);
  const [storedUsers, setStoredUsers] = useState<
    Array<{
      chatId: string;
      username?: string;
      firstName?: string;
      lastName?: string;
      displayName?: string;
    }>
  >([]);
  const [showStoredUsers, setShowStoredUsers] = useState(false);
  const [specificChatId, setSpecificChatId] = useState("");
  const [sendToSpecific, setSendToSpecific] = useState(false);

  // Handle checkbox conflicts - only one can be selected at a time
  const handleSpecificChange = (checked: boolean) => {
    setSendToSpecific(checked);
    if (checked) {
      setSendToAll(false);
      setShowStoredUsers(false);
    }
  };

  const handleAllChange = (checked: boolean) => {
    setSendToAll(checked);
    if (checked) {
      setSendToSpecific(false);
      setShowStoredUsers(false);
    }
  };

  const handleStoredUsersLoad = async () => {
    try {
      const res = await fetch("/api/bot/chat-ids");
      const data = await res.json();
      if (data.success) {
        setStoredUsers(data.users || []);
        setShowStoredUsers(true);
        setSendToSpecific(false);
        setSendToAll(false);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

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
          chatId: sendToSpecific ? specificChatId : undefined,
          chatIds: sendToAll
            ? chatIds
                .split(",")
                .map((id) => id.trim())
                .filter((id) => id)
            : showStoredUsers && storedUsers.length > 0
            ? storedUsers.map((user) => user.chatId)
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
      if (sendToSpecific && specificChatId) {
        formData.append("chatId", specificChatId);
      } else if (sendToAll && chatIds) {
        formData.append("chatIds", chatIds);
      } else if (showStoredUsers && storedUsers.length > 0) {
        formData.append(
          "chatIds",
          storedUsers.map((user) => user.chatId).join(",")
        );
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

  const clearStoredUsers = async () => {
    if (!confirm("Are you sure you want to clear all stored users?")) return;

    try {
      const res = await fetch("/api/bot/chat-ids", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setStoredUsers([]);
        setShowStoredUsers(false);
        setResponse("All users cleared");
      }
    } catch (error) {
      setResponse("Error clearing users");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Left Column - User Management */}
        <div className="lg:col-span-1 space-y-6">
          {/* Stored Users Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/10 p-4 lg:p-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 lg:mb-6">
              <h3 className="text-base lg:text-lg font-semibold text-white flex items-center gap-2 lg:gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg lg:rounded-xl flex items-center justify-center">
                  <svg
                    className="w-4 h-4 lg:w-5 lg:h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Stored Users
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleStoredUsersLoad}
                  className="px-3 lg:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg lg:rounded-xl hover:from-blue-600 hover:to-blue-700 text-xs lg:text-sm font-medium transition-all duration-300 shadow-lg shadow-blue-500/25"
                >
                  Load
                </button>
                <button
                  onClick={clearStoredUsers}
                  className="px-3 lg:px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg lg:rounded-xl hover:from-red-600 hover:to-red-700 text-xs lg:text-sm font-medium transition-all duration-300 shadow-lg shadow-red-500/25"
                >
                  Clear
                </button>
              </div>
            </div>

            {showStoredUsers && (
              <div className="space-y-3 lg:space-y-4">
                <div className="text-xs lg:text-sm text-gray-300 font-medium flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  {storedUsers.length} users found
                </div>
                <div className="max-h-48 lg:max-h-64 overflow-y-auto space-y-2 lg:space-y-3">
                  {storedUsers.map((user) => (
                    <div
                      key={user.chatId}
                      className="flex items-center justify-between p-3 lg:p-4 bg-white/5 rounded-xl lg:rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate text-sm lg:text-base">
                          {user.displayName ||
                            user.username ||
                            user.firstName ||
                            `User ${user.chatId}`}
                        </div>
                        <div className="text-xs text-gray-400">
                          {user.chatId}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Send Options Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/10 p-4 lg:p-6 shadow-2xl">
            <h3 className="text-base lg:text-lg font-semibold text-white mb-4 lg:mb-6 flex items-center gap-2 lg:gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg lg:rounded-xl flex items-center justify-center">
                <svg
                  className="w-4 h-4 lg:w-5 lg:h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              Send Options
            </h3>

            <div className="space-y-4 lg:space-y-5">
              {/* Specific Chat ID */}
              <div className="space-y-2 lg:space-y-3">
                <label className="flex items-center gap-2 lg:gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="radio"
                      name="sendOption"
                      checked={sendToSpecific}
                      onChange={(e) => handleSpecificChange(e.target.checked)}
                      className="w-4 lg:w-5 h-4 lg:h-5 text-blue-500 border-white/20 focus:ring-blue-500 bg-white/5"
                    />
                  </div>
                  <span className="text-xs lg:text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                    Specific Chat ID
                  </span>
                </label>
                {sendToSpecific && (
                  <input
                    type="text"
                    value={specificChatId}
                    onChange={(e) => setSpecificChatId(e.target.value)}
                    placeholder="Enter chat ID..."
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-white/5 border border-white/10 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs lg:text-sm text-white placeholder-gray-400"
                  />
                )}
              </div>

              {/* Multiple Chat IDs */}
              <div className="space-y-2 lg:space-y-3">
                <label className="flex items-center gap-2 lg:gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="radio"
                      name="sendOption"
                      checked={sendToAll}
                      onChange={(e) => handleAllChange(e.target.checked)}
                      className="w-4 lg:w-5 h-4 lg:h-5 text-blue-500 border-white/20 focus:ring-blue-500 bg-white/5"
                    />
                  </div>
                  <span className="text-xs lg:text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                    Multiple Chat IDs
                  </span>
                </label>
                {sendToAll && (
                  <textarea
                    value={chatIds}
                    onChange={(e) => setChatIds(e.target.value)}
                    placeholder="Enter chat IDs separated by commas..."
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-white/5 border border-white/10 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs lg:text-sm text-white placeholder-gray-400"
                    rows={3}
                  />
                )}
              </div>

              {/* Stored Users Option */}
              <div className="space-y-2 lg:space-y-3">
                <label className="flex items-center gap-2 lg:gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="radio"
                      name="sendOption"
                      checked={showStoredUsers && storedUsers.length > 0}
                      onChange={() => {
                        if (storedUsers.length > 0) {
                          setShowStoredUsers(true);
                          setSendToSpecific(false);
                          setSendToAll(false);
                        }
                      }}
                      disabled={storedUsers.length === 0}
                      className="w-4 lg:w-5 h-4 lg:h-5 text-blue-500 border-white/20 focus:ring-blue-500 bg-white/5 disabled:opacity-50"
                    />
                  </div>
                  <span
                    className={`text-xs lg:text-sm font-medium transition-colors ${
                      storedUsers.length === 0
                        ? "text-gray-500"
                        : "text-gray-200 group-hover:text-white"
                    }`}
                  >
                    All Stored Users ({storedUsers.length})
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Message & Image Sending */}
        <div className="lg:col-span-3 space-y-6">
          {/* Text Message Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/10 p-4 lg:p-8 shadow-2xl">
            <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6 flex items-center gap-2 lg:gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 lg:w-6 lg:h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              Send Text Message
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 px-4 lg:px-6 py-3 lg:py-4 bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-base lg:text-lg"
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !message.trim()}
                className="px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl lg:rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-300 shadow-lg shadow-blue-500/25 text-sm lg:text-base"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="w-4 lg:w-5 h-4 lg:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Sending...</span>
                    <span className="sm:hidden">...</span>
                  </div>
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </div>

          {/* Image Upload Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/10 p-4 lg:p-8 shadow-2xl">
            <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6 flex items-center gap-2 lg:gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl lg:rounded-2xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 lg:w-6 lg:h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              Send Image
            </h3>
            <div className="space-y-4 lg:space-y-6">
              <div className="border-2 border-dashed border-white/20 rounded-xl lg:rounded-2xl p-6 lg:p-8 text-center hover:border-white/30 transition-all duration-300 bg-white/5">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <svg
                    className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4 lg:mb-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-gray-300 text-base lg:text-lg">
                    <span className="font-medium text-blue-300 hover:text-blue-200 transition-colors">
                      Click to upload
                    </span>{" "}
                    <span className="hidden sm:inline">or drag and drop</span>
                  </div>
                  <p className="text-xs lg:text-sm text-gray-400 mt-2">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </label>
              </div>

              {imageFile && (
                <div className="flex items-center justify-between p-3 lg:p-4 bg-white/5 rounded-xl lg:rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <svg
                      className="w-5 h-5 lg:w-6 lg:h-6 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-white font-medium text-sm lg:text-base truncate">
                      {imageFile.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setImageFile(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-4 h-4 lg:w-5 lg:h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}

              <button
                onClick={sendImage}
                disabled={isLoading || !imageFile}
                className="w-full px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl lg:rounded-2xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-300 shadow-lg shadow-green-500/25 text-sm lg:text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 lg:gap-3">
                    <div className="w-4 lg:w-5 h-4 lg:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Sending Image...</span>
                    <span className="sm:hidden">Sending...</span>
                  </div>
                ) : (
                  "Send Image"
                )}
              </button>
            </div>
          </div>

          {/* Response Card */}
          {response && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/10 p-4 lg:p-6 shadow-2xl">
              <h4 className="font-semibold text-white mb-3 lg:mb-4 flex items-center gap-2 lg:gap-3">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg lg:rounded-xl flex items-center justify-center">
                  <svg
                    className="w-3 h-3 lg:w-4 lg:h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                Response
              </h4>
              <div className="p-3 lg:p-4 bg-white/5 rounded-xl lg:rounded-2xl border border-white/10">
                <p className="text-gray-200 text-sm lg:text-base">{response}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
