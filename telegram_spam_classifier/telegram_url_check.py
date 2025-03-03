import pickle
import re
import requests
from flask import Flask, jsonify
from flask_cors import CORS
from telethon import TelegramClient
import asyncio

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained phishing detection model
try:
    with open("spam_classifier.pkl", "rb") as file:
        model = pickle.load(file)
except Exception as e:
    print(f"Error loading model: {e}")

# Telegram API credentials
API_ID = 1234
API_HASH = "hash"
CHANNEL_ID = 1234  # Ensure it's negative for supergroups/channels

# VirusTotal API Key
VIRUSTOTAL_API_KEY = "1234"

# Function to preprocess the message
def preprocess_message(text):
    return [text]  # Modify if preprocessing is required

# Function to extract URLs from a message
def extract_url(text):
    url_pattern = r"https?://[^\s]+"  # Regex pattern to detect URLs
    return re.findall(url_pattern, text) or []

# Function to check URL on VirusTotal
def check_url_virustotal(url):
    url_scan_endpoint = "https://www.virustotal.com/api/v3/urls"
    headers = {"x-apikey": VIRUSTOTAL_API_KEY}
    data = {"url": url}

    try:
        response = requests.post(url_scan_endpoint, headers=headers, data=data)
        if response.status_code == 200:
            result = response.json()
            url_id = result["data"]["id"]

            # Fetch scan results
            scan_result_endpoint = f"https://www.virustotal.com/api/v3/analyses/{url_id}"
            result_response = requests.get(scan_result_endpoint, headers=headers)

            if result_response.status_code == 200:
                analysis = result_response.json()
                malicious_count = analysis["data"]["attributes"]["stats"]["malicious"]
                return {"url": url, "malicious_count": malicious_count}
    except Exception as e:
        return {"url": url, "error": str(e)}

    return {"url": url, "error": "Error checking URL"}

# Function to fetch and predict phishing messages
async def fetch_and_predict():
    results = []
    try:
        async with TelegramClient("session_name", API_ID, API_HASH) as client:
            messages = await client.get_messages(CHANNEL_ID, limit=10)  # Fetch last 10 messages

            for msg in messages:
                text = msg.text
                if not text:
                    continue

                message_result = {"message": text, "urls": [], "is_phishing": False}
                urls = extract_url(text)

                if urls:
                    for url in urls:
                        url_result = check_url_virustotal(url)
                        message_result["urls"].append(url_result)

                non_url_text = re.sub(r"https?://[^\s]+", "", text).strip()
                if non_url_text:
                    prediction = model.predict(preprocess_message(non_url_text))
                    message_result["is_phishing"] = bool(prediction[0] == 1)

                results.append(message_result)

    except Exception as e:
        print(f"Error fetching messages: {e}")

    return results

@app.route("/check_messages", methods=["GET"])
def check_messages():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    messages_data = loop.run_until_complete(fetch_and_predict())

    return jsonify({"messages": messages_data})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
