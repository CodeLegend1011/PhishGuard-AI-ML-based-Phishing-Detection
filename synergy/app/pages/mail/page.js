"use client"; // Ensure this is a client component

import { useState, useEffect } from "react";
import Layout from "../../../components/ui/layout";

// Function to fetch phishing emails from the backend API
const fetchPhishingEmails = async () => {
  try {
    const response = await fetch("http://localhost:8080/fetch-emails"); // API route
    if (!response.ok) {
      throw new Error("Failed to fetch emails");
    }
    const emails = await response.json();
    return emails;
  } catch (error) {
    console.error("Error fetching phishing emails:", error);
    return [];
  }
};

export default function Mail() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  // Function to start fetching emails and schedule automatic fetching
  const handleStartFetching = () => {
    setLoading(true);
    fetchPhishingEmails().then((fetchedEmails) => {
      setEmails(fetchedEmails);
      setLoading(false);
      setScheduled(true);

      // Clear any existing interval before setting a new one
      if (intervalId) {
        clearInterval(intervalId);
      }

      // Schedule fetch every 10 minutes
      const newIntervalId = setInterval(() => {
        fetchPhishingEmails().then(setEmails);
      }, 10 * 60 * 1000);

      setIntervalId(newIntervalId);
    });
  };

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Phishing Email Detection</h1>

      {/* Button to start fetching emails and schedule auto-fetching */}
      <button
        className="p-2 bg-blue-600 text-white rounded mb-6 hover:bg-blue-700 disabled:bg-gray-400"
        onClick={handleStartFetching}
        disabled={loading || scheduled}
      >
        {loading ? "Fetching..." : scheduled ? "Fetching Scheduled" : "Start Fetching Emails"}
      </button>

      {/* Display fetched emails */}
      {emails.length === 0 && !loading && <p>No emails found.</p>}

      <div className="space-y-4">
        {emails.map((email, index) => (
          <div key={index} className="p-4 border rounded bg-gray-700">
            <h2 className="text-lg font-semibold">Subject: {email.subject}</h2>
            <p><strong>From:</strong> {email.from}</p>
            <p><strong>Snippet:</strong> {email.snippet}</p>

            {/* Show URLs found in the email */}
            {email.urls.length > 0 && (
              <div>
                <strong>URLs:</strong>
                <ul className="list-disc pl-5">
                  {email.urls.map((url, idx) => (
                    <li key={idx}>
                      <a href={url} className="text-blue-600" target="_blank" rel="noopener noreferrer">
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Show phishing URLs if any */}
            {email.phishingUrls.length > 0 && (
              <div>
                <strong className="text-red-600">⚠️ Phishing URLs Detected:</strong>
                <ul className="list-disc pl-5">
                  {email.phishingUrls.map((url, idx) => (
                    <li key={idx} className="text-red-600">
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Show domain reputation */}
            {email.domainReputation.length > 0 && (
              <div>
                <strong>Domain Reputation:</strong>
                <ul className="list-disc pl-5">
                  {email.domainReputation.map((rep, idx) => (
                    <li key={idx}>{rep}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Show phishing detection result */}
            <p>
              <strong>Email Status:</strong>{" "}
              <span className={email.isPhishingEmail ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                {email.isPhishingEmail ? "🚨 Phishing Detected" : "✅ Safe Email"}
              </span>
            </p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
