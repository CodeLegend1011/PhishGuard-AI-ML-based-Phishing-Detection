
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import os
import tldextract
import re
from fastapi.middleware.cors import CORSMiddleware  # Import CORSMiddleware

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import threading

# Define paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.abspath(os.path.join(BASE_DIR, "../models"))

# Model paths
url_model_path = os.path.join(MODEL_DIR, "phishing_url_model.pkl")
email_model_path = os.path.join(MODEL_DIR, "phishing_email_model.pkl")
scaler_path = os.path.join(MODEL_DIR, "scaler.pkl")
vectorizer_path = os.path.join(MODEL_DIR, "tfidf_vectorizer.pkl")
spam_model_path = os.path.join(MODEL_DIR, "spam_classifier.pkl")

# Ensure all models exist
for path in [url_model_path, email_model_path, scaler_path, vectorizer_path, spam_model_path]:
    if not os.path.exists(path):
        raise FileNotFoundError(f"❌ Required model file not found: {path}. Train the models first.")

# Load trained models and pre-processing tools
url_model = joblib.load(url_model_path)
email_model = joblib.load(email_model_path)
scaler = joblib.load(scaler_path)
vectorizer = joblib.load(vectorizer_path)
spam_model = joblib.load(spam_model_path)  # Flask-based spam classifier

# FastAPI app (FIX: Changed from `fastapi_app` to `app`)
app = FastAPI(title="Phishing Detection API", version="1.0")

# Add CORS middleware to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now (can be restricted later)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Flask app for compatibility
flask_app = Flask(__name__)
CORS(flask_app)  # Enable CORS for frontend communication

# Label Mapping
url_label_mapping = {0: "Benign", 1: "Defacement", 2: "Malware", 3: "Phishing"}
email_label_mapping = {0: "Safe Email", 1: "Phishing Email"}

# Request Body Models
class URLRequest(BaseModel):
    url: str

class EmailRequest(BaseModel):
    email_text: str

def extract_url_features(url):
    """
    Extract numerical and categorical features from a URL for prediction.
    """
    features = {
        "url_length": len(url),
        "num_dots": url.count("."),
        "num_hyphens": url.count("-"),
        "num_slashes": url.count("/"),
        "num_at": url.count("@"),
        "num_percent": url.count("%"),
        "num_equals": url.count("="),
        "num_question": url.count("?"),
        "num_ampersand": url.count("&"),
        "num_digits": sum(c.isdigit() for c in url),
        "https": 1 if url.startswith("https") else 0
    }

    extracted = tldextract.extract(url)
    features["subdomain_length"] = len(extracted.subdomain)
    features["domain_length"] = len(extracted.domain)
    features["tld_length"] = len(extracted.suffix)

    return pd.DataFrame([features])

def preprocess_email(email_text):
    """
    Preprocess email text and transform it using the TF-IDF vectorizer.
    """
    if pd.isna(email_text) or not isinstance(email_text, str):
        email_text = ""

    email_text = re.sub(r"\s+", " ", email_text).strip().lower()  # Normalize spaces & convert to lowercase
    email_text = re.sub(r"[^\w\s]", "", email_text)  # Remove punctuation/special characters

    # Transform using the trained TF-IDF vectorizer
    email_features = vectorizer.transform([email_text])

    return email_features

@app.post("/predict/url/")
async def predict_url(request: URLRequest):
    """
    Predict if a URL is Phishing, Benign, Malware, or Defacement.
    """
    url = request.url.strip()
    features_df = extract_url_features(url)

    # Standardize features
    features_scaled = scaler.transform(features_df)

    # Predict
    prediction = url_model.predict(features_scaled)[0]
    prediction_label = url_label_mapping[prediction]

    return {"url": url, "prediction": prediction_label}

@app.post("/predict/email/")
async def predict_email(request: EmailRequest):
    """
    Predict if an email is phishing or safe.
    """
    email_text = request.email_text.strip()
    features_df = preprocess_email(email_text)

    # Predict
    prediction = email_model.predict(features_df)[0]
    prediction_label = email_label_mapping[prediction]

    return {"email": email_text[:50] + ('...' if len(email_text) > 50 else ''), "prediction": prediction_label}

@flask_app.route("/predict/text", methods=["POST"])
def predict_spam():
    """
    Predict if an email is spam or not using Flask (Frontend Compatible).
    """
    data = request.json.get("text")  # Get text input from JSON request

    if not data or not isinstance(data, str):
        return jsonify({"error": "Invalid input. Expected a non-empty text string."}), 400

    # Preprocess text (model pipeline handles TF-IDF)
    data = data.lower().strip()

    # Pass raw text directly (since spam_model includes preprocessing)
    prediction = spam_model.predict([data])[0]
    result = "Phishing" if prediction == 1 else "Legitimate"

    return jsonify({"prediction": result})

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Phishing Detection API is running!"}

def run_flask():
    """
    Run Flask server in a separate thread.
    """
    flask_app.run(host="0.0.0.0", port=5001, debug=False)

# Start Flask server in the background
flask_thread = threading.Thread(target=run_flask, daemon=True)
flask_thread.start()
