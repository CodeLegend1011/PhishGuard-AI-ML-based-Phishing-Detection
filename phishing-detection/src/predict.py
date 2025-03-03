import pandas as pd
import joblib
import os
import tldextract
import re
import argparse

# Define paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.abspath(os.path.join(BASE_DIR, "../models"))

url_model_path = os.path.join(MODEL_DIR, "phishing_url_model.pkl")
email_model_path = os.path.join(MODEL_DIR, "phishing_email_model.pkl")
scaler_path = os.path.join(MODEL_DIR, "scaler.pkl")
vectorizer_path = os.path.join(MODEL_DIR, "tfidf_vectorizer.pkl")  # TF-IDF vectorizer

# Ensure models exist
for path in [url_model_path, email_model_path, scaler_path, vectorizer_path]:
    if not os.path.exists(path):
        raise FileNotFoundError(f"❌ Required model file not found: {path}. Train the models first.")

# Load trained models and pre-processing tools
url_model = joblib.load(url_model_path)
email_model = joblib.load(email_model_path)
scaler = joblib.load(scaler_path)
vectorizer = joblib.load(vectorizer_path)

# Label Mapping
url_label_mapping = {0: "Benign", 1: "Defacement", 2: "Malware", 3: "Phishing"}
email_label_mapping = {0: "Safe Email", 1: "Phishing Email"}

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

def predict_url(url):
    """
    Predict if a URL is Phishing, Benign, Malware, or Defacement.
    """
    features_df = extract_url_features(url)
    features_scaled = scaler.transform(features_df)
    prediction = url_model.predict(features_scaled)[0]
    return url_label_mapping[prediction]

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

def predict_email(email_text):
    """
    Predict if an email is phishing or safe.
    """
    features_df = preprocess_email(email_text)
    prediction = email_model.predict(features_df)[0]
    return email_label_mapping[prediction]

# Command-line support
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Predict if a URL or Email is phishing or safe.")
    parser.add_argument("--url", type=str, help="Enter a URL to classify.")
    parser.add_argument("--email", type=str, help="Enter an Email text to classify.")

    args = parser.parse_args()

    if args.url:
        result = predict_url(args.url)
        print(f"🔍 URL: {args.url}")
        print(f"🛡️ Prediction: {result}")

    if args.email:
        result = predict_email(args.email)
        print(f"📧 Email: {args.email[:50]}...")  # Print first 50 chars
        print(f"🛡️ Prediction: {result}")

    if not args.url and not args.email:
        print("❌ Please provide either a --url or --email argument.")
