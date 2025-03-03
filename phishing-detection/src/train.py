import pandas as pd
import os
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler

# Define paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.abspath(os.path.join(BASE_DIR, "../data"))
MODEL_DIR = os.path.abspath(os.path.join(BASE_DIR, "../models"))

# Ensure model directory exists
os.makedirs(MODEL_DIR, exist_ok=True)

# File paths
url_train_file = os.path.join(DATA_DIR, "train_urls.csv")
url_test_file = os.path.join(DATA_DIR, "test_urls.csv")
email_train_file = os.path.join(DATA_DIR, "train_emails.csv")
email_test_file = os.path.join(DATA_DIR, "test_emails.csv")

url_model_path = os.path.join(MODEL_DIR, "phishing_url_model.pkl")
email_model_path = os.path.join(MODEL_DIR, "phishing_email_model.pkl")
scaler_path = os.path.join(MODEL_DIR, "scaler.pkl")
vectorizer_path = os.path.join(MODEL_DIR, "tfidf_vectorizer.pkl")

# Training function for numerical data (URLs)
def train_numerical_model(train_file, test_file, model_path, label_column):
    if not os.path.exists(train_file) or not os.path.exists(test_file):
        print(f"❌ Train or Test dataset not found for {train_file}. Skipping training.")
        return
    
    print(f"🚀 Training numerical model for dataset: {train_file}")

    # Load data
    train_df = pd.read_csv(train_file)
    test_df = pd.read_csv(test_file)

    # Separate features and labels
    X_train = train_df.drop(columns=[label_column])
    y_train = train_df[label_column]
    X_test = test_df.drop(columns=[label_column])
    y_test = test_df[label_column]

    # Standardize features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Train model (Logistic Regression)
    model = LogisticRegression(max_iter=1000, random_state=42)
    model.fit(X_train_scaled, y_train)

    # Predictions
    y_pred = model.predict(X_test_scaled)

    # Evaluate model
    accuracy = accuracy_score(y_test, y_pred)
    print(f"✅ Model Training Completed for {train_file} - Accuracy: {accuracy:.4f}\n")
    print("📊 Classification Report:\n", classification_report(y_test, y_pred))

    # Save model and scaler
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)

    print(f"✅ Model saved to: {model_path}")

# Training function for text data (Emails)
def train_text_model(train_file, test_file, model_path, text_column, label_column):
    if not os.path.exists(train_file) or not os.path.exists(test_file):
        print(f"❌ Train or Test dataset not found for {train_file}. Skipping training.")
        return
    
    print(f"🚀 Training text model for dataset: {train_file}")

    # Load data
    train_df = pd.read_csv(train_file)
    test_df = pd.read_csv(test_file)

    # Extract text and labels
    X_train_text = train_df[text_column].fillna("")
    y_train = train_df[label_column]
    X_test_text = test_df[text_column].fillna("")
    y_test = test_df[label_column]

    # Convert text to numerical features using TF-IDF
    vectorizer = TfidfVectorizer(max_features=5000)  # Limit features for efficiency
    X_train_tfidf = vectorizer.fit_transform(X_train_text)
    X_test_tfidf = vectorizer.transform(X_test_text)

    # Train model
    model = LogisticRegression(max_iter=1000, random_state=42)
    model.fit(X_train_tfidf, y_train)

    # Predictions
    y_pred = model.predict(X_test_tfidf)

    # Evaluate model
    accuracy = accuracy_score(y_test, y_pred)
    print(f"✅ Model Training Completed for {train_file} - Accuracy: {accuracy:.4f}\n")
    print("📊 Classification Report:\n", classification_report(y_test, y_pred))

    # Save model and vectorizer
    joblib.dump(model, model_path)
    joblib.dump(vectorizer, vectorizer_path)

    print(f"✅ Model saved to: {model_path}")

# Train URL phishing model (numerical data)
train_numerical_model(url_train_file, url_test_file, url_model_path, "label")

# Train Email phishing model (text data)
train_text_model(email_train_file, email_test_file, email_model_path, "Email Text", "Label")

