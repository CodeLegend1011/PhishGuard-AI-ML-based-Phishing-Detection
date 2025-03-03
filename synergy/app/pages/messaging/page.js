"use client";
import { useState, useEffect } from "react";
import Layout from "../../../components/ui/layout";

export default function Messaging() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/check_messages");
        if (!response.ok) {
          throw new Error("Failed to fetch messages.");
        }
        const data = await response.json();
        setMessages(data.messages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Messaging</h1>
      <p>Detect whether a message, email, or URL is spam.</p>

      {loading && <p>Loading messages...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-4">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className="p-4 border bg-gray-700 rounded-md mb-2">
              <p className="font-semibold">Message:</p>
              <p className="text-white">{msg.message}</p>

              <p className="font-semibold mt-2">Phishing Status:</p>
              <p className={msg.is_phishing ? "text-red-500" : "text-green-500"}>
                {msg.is_phishing ? "⚠️ Phishing Detected!" : "✅ Safe"}
              </p>

              {msg.urls.length > 0 && (
                <>
                  <p className="font-semibold mt-2">URLs Found:</p>
                  <ul className="list-disc pl-4">
                    {msg.urls.map((urlData, idx) => (
                      <li key={idx} className="text-blue-500 break-all">
                        {urlData.url} -{" "}
                        {urlData.malicious_count > 0 ? (
                          <span className="text-red-500">Malicious</span>
                        ) : (
                          <span className="text-green-500">Safe</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No messages detected yet.</p>
        )}
      </div>
    </Layout>
  );
}
