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

  // Check if user has selected a valid send option
  const hasValidSendOption = () => {
    if (sendToSpecific && specificChatId.trim()) return true;
    if (sendToAll && chatIds.trim()) return true;
    if (showStoredUsers && storedUsers.length > 0) return true;
    return false;
  };

  // Get current send option status for display
  const getSendOptionStatus = () => {
    if (sendToSpecific) {
      return specificChatId.trim()
        ? "Ready to send to specific chat ID"
        : "Please enter a chat ID";
    }
    if (sendToAll) {
      return chatIds.trim()
        ? "Ready to send to multiple chat IDs"
        : "Please enter chat IDs";
    }
    if (showStoredUsers) {
      return storedUsers.length > 0
        ? `Ready to send to ${storedUsers.length} stored users`
        : "No stored users available";
    }
    return "Please select a send option";
  };

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
    if (!message.trim()) {
      setResponse("Please enter a message to send");
      return;
    }

    if (!hasValidSendOption()) {
      setResponse("Please select a send option and provide chat ID(s)");
      return;
    }

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
    if (!imageFile) {
      setResponse("Please select an image to send");
      return;
    }

    if (!hasValidSendOption()) {
      setResponse("Please select a send option and provide chat ID(s)");
      return;
    }

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
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/10 p-4 lg:p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/8 group">
            <div className="flex flex-col sm:items-center sm:justify-between gap-4 mb-4 lg:mb-6">
              <h3 className="text-base lg:text-lg font-semibold text-white flex items-center gap-2 lg:gap-3 group-hover:text-blue-200 transition-colors">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
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
                  className="px-3 lg:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg lg:rounded-xl hover:from-blue-600 hover:to-blue-700 text-xs lg:text-sm font-medium transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105 flex items-center gap-2"
                >
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Load
                </button>
                <button
                  onClick={clearStoredUsers}
                  className="px-3 lg:px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg lg:rounded-xl hover:from-red-600 hover:to-red-700 text-xs lg:text-sm font-medium transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-xl hover:scale-105 flex items-center gap-2"
                >
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Clear
                </button>
              </div>
            </div>

            {showStoredUsers && (
              <div className="space-y-3 lg:space-y-4 animate-fade-in">
                {/* Stats Bar */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs lg:text-sm text-gray-300 font-medium">
                      {storedUsers.length} users found
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">
                      {storedUsers.length}
                    </span>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
                  />
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                {/* Users List */}
                <div className="max-h-48 lg:max-h-64 overflow-y-auto space-y-2 lg:space-y-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  {storedUsers.map((user, index) => (
                    <div
                      key={user.chatId}
                      className="group/user flex items-center justify-between p-3 lg:p-4 bg-white/5 rounded-xl lg:rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* User Avatar */}
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover/user:scale-110 transition-transform">
                          <span className="text-white font-semibold text-xs lg:text-sm">
                            {(
                              user.displayName ||
                              user.username ||
                              user.firstName ||
                              user.chatId
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white truncate text-sm lg:text-base group-hover/user:text-blue-200 transition-colors">
                            {user.displayName ||
                              user.username ||
                              user.firstName ||
                              `User ${user.chatId}`}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="text-xs text-gray-400 font-mono bg-gray-800/50 px-2 py-1 rounded-lg">
                              {user.chatId}
                            </div>
                            {user.username && (
                              <div className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded-lg">
                                @{user.username}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 opacity-0 group-hover/user:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setSpecificChatId(user.chatId);
                            setSendToSpecific(true);
                            setSendToAll(false);
                            setShowStoredUsers(false);
                          }}
                          className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                          title="Use this chat ID"
                        >
                          <svg
                            className="w-3 h-3 text-blue-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(user.chatId)
                          }
                          className="p-1.5 bg-gray-500/20 hover:bg-gray-500/30 rounded-lg transition-colors"
                          title="Copy chat ID"
                        >
                          <svg
                            className="w-3 h-3 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {storedUsers.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm">No users found</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Click "Load" to fetch stored users
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Initial State */}
            {!showStoredUsers && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">Ready to load users</p>
                <p className="text-gray-500 text-xs mt-1">
                  Click "Load" to fetch stored users
                </p>
              </div>
            )}
          </div>

          {/* Send Options Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/10 p-4 lg:p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/8 group">
            <h3 className="text-base lg:text-lg font-semibold text-white mb-4 lg:mb-6 flex items-center gap-2 lg:gap-3 group-hover:text-green-200 transition-colors">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
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

            {/* Status Indicator */}
            <div className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/8 transition-colors">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    hasValidSendOption() ? "bg-green-400" : "bg-yellow-400"
                  } animate-pulse`}
                ></div>
                <span className="text-xs lg:text-sm text-gray-300">
                  {getSendOptionStatus()}
                </span>
              </div>
            </div>

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
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-white/5 border border-white/10 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs lg:text-sm text-white placeholder-gray-400 hover:bg-white/8 transition-colors"
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
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-white/5 border border-white/10 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs lg:text-sm text-white placeholder-gray-400 hover:bg-white/8 transition-colors"
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
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/10 p-4 lg:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/8 group">
            <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6 flex items-center gap-2 lg:gap-3 group-hover:text-blue-200 transition-colors">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
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
                className="flex-1 px-4 lg:px-6 py-3 lg:py-4 bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-base lg:text-lg hover:bg-white/8 transition-colors"
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !message.trim() || !hasValidSendOption()}
                className="px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl lg:rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-300 shadow-lg shadow-blue-500/25 text-sm lg:text-base hover:shadow-xl hover:scale-105"
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
            {!hasValidSendOption() && (
              <p className="text-xs text-yellow-400 mt-2 flex items-center gap-1 animate-pulse">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Please select a send option and provide chat ID(s) first
              </p>
            )}
          </div>

          {/* Image Upload Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/10 p-4 lg:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/8 group">
            <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6 flex items-center gap-2 lg:gap-3 group-hover:text-green-200 transition-colors">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
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
              <div className="border-2 border-dashed border-white/20 rounded-xl lg:rounded-2xl p-6 lg:p-8 text-center hover:border-white/30 transition-all duration-300 bg-white/5 hover:bg-white/8 group/upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <svg
                    className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4 lg:mb-6 group-hover/upload:text-blue-400 transition-colors"
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
                <div className="flex items-center justify-between p-3 lg:p-4 bg-white/5 rounded-xl lg:rounded-2xl border border-white/10 hover:bg-white/8 transition-colors animate-fade-in">
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
                    className="text-gray-400 hover:text-white transition-colors hover:scale-110"
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
                disabled={isLoading || !imageFile || !hasValidSendOption()}
                className="w-full px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl lg:rounded-2xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-300 shadow-lg shadow-green-500/25 text-sm lg:text-base hover:shadow-xl hover:scale-105"
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
              {!hasValidSendOption() && (
                <p className="text-xs text-yellow-400 flex items-center gap-1 animate-pulse">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Please select a send option and provide chat ID(s) first
                </p>
              )}
            </div>
          </div>

          {/* Response Card */}
          {response && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/10 p-4 lg:p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/8 animate-fade-in">
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
              <div className="p-3 lg:p-4 bg-white/5 rounded-xl lg:rounded-2xl border border-white/10 hover:bg-white/8 transition-colors">
                <p className="text-gray-200 text-sm lg:text-base">{response}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
