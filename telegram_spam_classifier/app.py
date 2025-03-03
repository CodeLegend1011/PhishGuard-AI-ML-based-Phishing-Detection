from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load your trained model
model = joblib.load("spam_classifier.pkl")  # Update with your model filename
#vectorizer = joblib.load("vectorizer.pkl")  # If using text vectorization

@app.route("/telegram", methods=["POST"])
def predict():
    data = request.json.get("text")  # Get text input from JSON request

    if not data:
        return jsonify({"error": "No input provided"}), 400

    # Transform input if needed (e.g., vectorize for NLP models)
    input_data = vectorizer.transform([data]) if "vectorizer" in globals() else np.array([data]) # type: ignore

    prediction = model.predict(input_data)[0]
    result = "Phishing" if prediction == 1 else "Legitimate"

    return jsonify({"prediction": result})

if __name__ == "__main__":
    app.run(debug=True)
