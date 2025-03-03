module.exports = fetchEmails;
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const axios = require("axios");
const whois = require("whois-json");

// Load credentials
const TOKEN_PATH = path.join(__dirname, "token.json");
const CREDENTIALS_PATH = path.join(__dirname, "client_secret.json");

// Authenticate Google API
async function authorize() {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
    
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.setCredentials(token);
    
    return oAuth2Client;
}

// Function to extract URLs from a string
function extractUrls(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
}

// Function to check URL against a phishing database (Google Safe Browsing API or PhishTank)
async function checkPhishingUrl(url) {
    try {
        const response = await axios.get(`https://www.virustotal.com/vtapi/v2/url/report`, {
            params: {
                apikey: "1234",
                resource: url,
            },
        });

        if (response.data.positives > 0) {
            return true; // URL is flagged as phishing
        }
    } catch (error) {
        console.error(`Error checking URL: ${url}`, error);
    }
    return false; // URL is not flagged
}

// Function to check domain reputation using WHOIS lookup
async function checkDomainReputation(url) {
    try {
        const domain = new URL(url).hostname;
        const whoisData = await whois(domain);

        if (whoisData.creationDate) {
            const domainAge = (new Date() - new Date(whoisData.creationDate)) / (1000 * 60 * 60 * 24); // Age in days
            if (domainAge < 90) {
                return "Newly registered domain (potentially suspicious)";
            }
        }
    } catch (error) {
        console.error("Error checking domain reputation:", error);
    }
    return "Domain reputation is unknown";
}

// Function to analyze email for phishing patterns
function detectPhishingPatterns(text) {
    const phishingKeywords = [
        "verify your account",
        "urgent action required",
        "password expired",
        "click here to reset",
        "suspicious activity detected",
        "update your payment information",
    ];

    const lowerText = text.toLowerCase();
    return phishingKeywords.some(keyword => lowerText.includes(keyword));
}

// Fetch emails from Gmail and analyze for phishing
async function fetchEmails() {
    try {
        const auth = await authorize();
        const gmail = google.gmail({ version: "v1", auth });

        const res = await gmail.users.messages.list({
            userId: "me",
            maxResults: 5, // Fetch latest 5 emails
        });

        const messages = res.data.messages || [];
        if (messages.length === 0) {
            return { message: "No emails found." };
        }

        // Fetch full email details
        const emailData = [];
        for (const msg of messages) {
            const email = await gmail.users.messages.get({ userId: "me", id: msg.id });
            
            // Extract important fields
            const headers = email.data.payload.headers;
            const from = headers.find(h => h.name === "From")?.value || "Unknown";
            const subject = headers.find(h => h.name === "Subject")?.value || "No Subject";
            const snippet = email.data.snippet || ""; // Short preview of the email content
            
            // Extract email body (only if available in text format)
            let emailBody = "";
            if (email.data.payload?.body?.data) {
                emailBody = Buffer.from(email.data.payload.body.data, "base64").toString("utf-8");
            } else if (email.data.payload?.parts) {
                for (const part of email.data.payload.parts) {
                    if (part.mimeType === "text/plain" && part.body?.data) {
                        emailBody = Buffer.from(part.body.data, "base64").toString("utf-8");
                        break;
                    }
                }
            }

            // Extract URLs from the email body
            const urls = extractUrls(emailBody);
            const phishingUrls = [];

            // Check each URL for phishing
            for (const url of urls) {
                const isPhishing = await checkPhishingUrl(url);
                if (isPhishing) phishingUrls.push(url);
            }

            // Check domain reputation
            const domainReputation = await Promise.all(urls.map(checkDomainReputation));

            // Detect phishing patterns in the email content
            const phishingPatternDetected = detectPhishingPatterns(emailBody);

            // Mark email as suspicious if any phishing signs are detected
            const isPhishingEmail = phishingPatternDetected || phishingUrls.length > 0;

            emailData.push({ 
                from, 
                subject, 
                snippet, 
                urls, 
                phishingUrls, 
                domainReputation, 
                isPhishingEmail 
            });
        }

        return emailData;
    } catch (error) {
        console.error("Error fetching emails:", error);
        return { error: "Failed to fetch emails" };
    }
}

module.exports = fetchEmails;

