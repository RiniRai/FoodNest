import { useState, useRef, useEffect } from "react";
import API from "../services/api";

function AIFoodAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! 👋 I'm your FoodNest AI Food Assistant. Tell me what you're craving, your budget, or your food preferences, and I'll help you find something delicious!",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading, isOpen]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const userMessage = message.trim();

    if (!userMessage || isLoading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage },
    ]);

    setMessage("");
    setIsLoading(true);

    try {
      const response = await API.post(
  "/ai/chat",
  { message: userMessage },
  { timeout: 20000 }
);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            response.data.reply ||
            "Sorry, I couldn't find a recommendation. Please try again.",
        },
      ]);
    } catch (error) {
  console.error(
    "FoodNest AI request failed:",
    error.response?.data || error.message
  );

  setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      text:
        error.response?.data?.message ||
        "Sorry, I'm having trouble connecting right now. Please try again.",
    },
  ]);
} finally {
  setIsLoading(false);
}
  };

  return (
    <div className="fixed bottom-5 right-5 z-[1000]">
      {isOpen && (
        <div className="mb-4 flex h-[480px] w-[350px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-2xl sm:w-[380px]">
          {/* Header */}
          <div className="flex items-center justify-between bg-orange-500 px-4 py-4 text-white">
            <div>
              <h2 className="font-bold">FoodNest AI Assistant</h2>
              <p className="text-xs text-orange-50">
                Your personal food guide ✨
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close AI assistant"
              className="rounded-full px-3 py-1 text-xl hover:bg-orange-600"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 space-y-4 overflow-y-auto bg-orange-50/40 p-4"
            aria-live="polite"
          >
            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex ${
                  item.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm ${
                    item.role === "user"
                      ? "rounded-br-sm bg-orange-500 text-white"
                      : "rounded-bl-sm border border-orange-100 bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  {item.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm text-gray-500 shadow-sm"
                  role="status"
                >
                  Thinking of something delicious...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 border-t border-orange-100 bg-white px-3 py-3">
              {[
                "Meals under ₹200",
                "Suggest vegetarian food",
                "Something spicy",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setMessage(suggestion)}
                  className="rounded-full border border-orange-200 px-3 py-2 text-xs text-orange-700 transition hover:bg-orange-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Message input */}
          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 border-t border-gray-100 bg-white p-3"
          >
            <input
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask about food..."
              aria-label="Message the AI food assistant"
              disabled={isLoading}
              className="min-w-0 flex-1 rounded-full border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
            />

            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="rounded-full bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close food assistant" : "Open food assistant"}
        aria-expanded={isOpen}
        className="ml-auto flex items-center gap-2 rounded-full bg-orange-500 px-5 py-4 font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-orange-600"
      >
        <span className="text-xl">🍽️</span>
        <span>{isOpen ? "Close Chat" : "Ask AI"}</span>
      </button>
    </div>
  );
}

export default AIFoodAssistant;