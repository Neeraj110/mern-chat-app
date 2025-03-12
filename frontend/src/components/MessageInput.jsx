import { Mic, Send } from "lucide-react";
import React, { useState } from "react";

function MessageInput() {
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  
    e.target.style.height = "auto";
    e.target.style.height = Math.min(120, e.target.scrollHeight) + "px";
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 sticky bottom-0 z-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-end">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={handleChange}
              placeholder="Message"
              className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-2xl px-4 py-3 pr-12 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden text-base"
            />

            <button className="absolute right-3 bottom-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2">
              <Mic />
            </button>
          </div>

          <button
            className={`ml-2 p-3 rounded-full focus:outline-none ${
              message.trim()
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!message.trim()}
          >
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageInput;
