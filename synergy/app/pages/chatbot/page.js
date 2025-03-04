"use client";

import { useState } from "react";
import Layout from "../../../components/ui/layout";

const GEMINI_API_KEY = " ";       // API key here

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const cleanResponse = (text) => {
    return text.replace(/\*/g, "").replace(/\n+/g, "\n").trim();
  };

  const handleChat = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: input }] }],
        }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      const botReply = cleanResponse(data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.");

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Error: Could not fetch response." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">AI Chatbot</h1>
      <div className="border p-4 rounded h-96 overflow-y-auto bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-3 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
            <span className={`p-3 rounded inline-block max-w-lg ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-700 text-white"}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex">
        <input
          type="text"
          className="w-full p-3 border rounded"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          className="ml-2 p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          onClick={handleChat}
          disabled={loading || !input.trim()}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </Layout>
  );
}
