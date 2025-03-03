import pandas as pd
import tldextract
import re
import os

# Get absolute paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.abspath(os.path.join(BASE_DIR, "../data"))

# File paths
url_dataset_path = os.path.join(DATA_DIR, "malicious_phish.csv")
email_dataset_path = os.path.join(DATA_DIR, "Phishing_Email.csv")
output_url_path = os.path.join(DATA_DIR, "processed_features.csv")
output_email_path = os.path.join(DATA_DIR, "processed_emails.csv")

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

# URL Feature Extraction
def extract_features(url):
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

    return features

# Process URL Dataset
def transform_url_dataset(csv_file):
    if not os.path.exists(csv_file):
        raise FileNotFoundError(f"❌ Dataset not found: {csv_file}")

    df = pd.read_csv(csv_file).dropna(subset=["url"])
    feature_df = pd.DataFrame(df["url"].apply(lambda x: extract_features(x)).tolist())

    label_mapping = {"benign": 0, "defacement": 1, "malware": 2, "phishing": 3}
    feature_df["label"] = df["type"].map(label_mapping)

    return feature_df

# Email Text Cleaning
def clean_email_text(text):
    if pd.isna(text):
        return ""  # Handle missing values
    text = re.sub(r'\s+', ' ', text)  # Remove extra spaces
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)  # Remove special characters
    return text.lower().strip()

# Process Email Dataset
def transform_email_dataset(csv_file):
    if not os.path.exists(csv_file):
        raise FileNotFoundError(f"❌ Dataset not found: {csv_file}")

    df = pd.read_csv(csv_file)
    df["Email Text"] = df["Email Text"].apply(clean_email_text)
    df["Label"] = df["Email Type"].map({"Safe Email": 0, "Phishing Email": 1})

    return df[["Email Text", "Label"]]

# Run Feature Extraction
if __name__ == "__main__":
    print(f"🔍 Processing URL dataset at: {url_dataset_path}")
    try:
        url_feature_data = transform_url_dataset(url_dataset_path)
        url_feature_data.to_csv(output_url_path, index=False)
        print(f"✅ URL feature extraction completed: {output_url_path}")
    except FileNotFoundError as e:
        print(str(e))

    print(f"🔍 Processing Email dataset at: {email_dataset_path}")
    try:
        email_feature_data = transform_email_dataset(email_dataset_path)
        email_feature_data.to_csv(output_email_path, index=False)
        print(f"✅ Email feature extraction completed: {output_email_path}")
    except FileNotFoundError as e:
        print(str(e))
