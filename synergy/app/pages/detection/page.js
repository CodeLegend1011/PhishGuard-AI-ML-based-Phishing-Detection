"use client"; // Ensure this is a client component

import { useState } from "react";
import Layout from "../../../components/ui/layout";

export default function Detection() {
  const [inputText, setInputText] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDetection = async (type) => {
    setLoading(true);
    setResult(null); // Reset previous results
    let endpoint = "";
    let data = {};

    if (type === "sms") {
      endpoint = "http://127.0.0.1:5001/predict/text";
      data = { text: inputText };
    } else if (type === "url") {
      endpoint = "http://127.0.0.1:5005/predict/url/";
      data = { url: inputUrl };
    } else if (type === "email") {
      endpoint = "http://127.0.0.1:5005/predict/email";
      data = { email_text: inputEmail };
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const resultData = await response.json();
      setResult(resultData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResult({ error: "Failed to fetch detection results." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Phishing Detection</h1>
      <p className="mb-6">Detect whether a message, email, or URL is a phishing scam.</p>

      {/* SMS Detection */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">SMS (Text) Detection</h2>
        <input
          type="text"
          className="w-full p-2 border rounded mt-2"
          placeholder="Enter SMS text..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button
          className="mt-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          onClick={() => handleDetection("sms")}
          disabled={loading || !inputText}
        >
          {loading ? "Detecting..." : "Detect SMS"}
        </button>
      </div>

      {/* URL Detection */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">URL Detection</h2>
        <input
          type="text"
          className="w-full p-2 border rounded mt-2"
          placeholder="Enter URL..."
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
        />
        <button
          className="mt-2 p-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          onClick={() => handleDetection("url")}
          disabled={loading || !inputUrl}
        >
          {loading ? "Detecting..." : "Detect URL"}
        </button>
      </div>

      {/* Email Content Detection */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Email Content Detection</h2>
        <textarea
          className="w-full p-2 border rounded mt-2"
          rows="4"
          placeholder="Enter email content..."
          value={inputEmail}
          onChange={(e) => setInputEmail(e.target.value)}
        ></textarea>
        <button
          className="mt-2 p-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
          onClick={() => handleDetection("email")}
          disabled={loading || !inputEmail}
        >
          {loading ? "Detecting..." : "Detect Email"}
        </button>
      </div>

      {/* Display Result */}
      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-700">
          <h3 className="text-lg text-white font-semibold">Detection Result:</h3>
          <div className="mt-2">
            {/* Beautify the response */}
            {result.url ? (
              <div>
                <strong>URL:</strong> <span className="text-blue-600">{result.url}</span>
              </div>
            ) : null}
            {result.prediction && (
              <div>
                <strong>Prediction:</strong> <span className="font-semibold">{result.prediction}</span>
              </div>
            )}
            {result.error && (
              <div className="text-red-600 mt-2">
                <strong>Error:</strong> {result.error}
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}

