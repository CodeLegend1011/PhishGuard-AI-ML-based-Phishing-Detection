# 🛡️ AI-Powered Phishing Detection System 🚀

## 📌 Overview  
The **AI-Powered Phishing Detection System** is a project designed to identify phishing URLs, detect email phishing scams. Using **Machine Learning (ML)** and **Threat Intelligence APIs**, this system enhances cybersecurity by detecting threats in real time.

## 🌟 Features  
✅ **Phishing URL Detection**: Classifies URLs as **benign, phishing, malware, or defacement** using ML.  
✅ **Email Phishing Scam Detection**: Analyzes email content to identify phishing attempts.  
✅ **Threat Intelligence API Integration**: Uses **VirusTotal, Shodan, BreachDirectory** for enhanced security insights.  
✅ **Real-time Monitoring Dashboard**: A **MERN Stack web app** to visualize security threats.  

---

## 🏗️ Installation & Setup  

### 🔧 Prerequisites  
Make sure you have the following installed:  
- 🐍 Python 3.8+  
- 💻 Node.js & npm  
- 📦 MongoDB  
- 🛜 Internet access for API calls  

### 📥 Clone the Repository  
```bash
git clone https://github.com/CodeLegend1011/PhishGuard-AI-ML-based-Phishing-Detection.git
cd PhishGuard-AI-ML-based-Phishing-Detection
```

### 📦 Install Dependencies  
#### 1️⃣ Backend (Python FastAPI)  
```bash
cd phishing-detection
pip install -r requirements.txt
```
#### 2️⃣ Frontend (React.js)  
```bash
cd synergy
npm install
```

### 🚀 Run the Project  
#### 1️⃣ Start the Backend Server  
```bash
cd phishing-detection
python -m uvicorn api.app:app --host 0.0.0.0 --port 8000 --reload

cd email-phishing-api\src
node .\server.js

cd telegram_spam_classifier
python .\telegram_url_check.py
```
#### 2️⃣ Start the Frontend  
```bash
cd synergy
npm start
```

---

## 📊 Dataset Information  
We use the following datasets for model training:  

📂 **`data/verified_online.csv`** (From PhishTank)  
- Contains **verified phishing websites**.  

📂 **`data/malicious_phish.csv`**  
- Labels URLs as **benign, phishing, malware, or defacement**.  

📂 **`data/Phishing_mail.csv`**  
- Used for **email phishing detection** based on message content.  

---

## 🧠 Model Training  
The ML model is trained using **Scikit-Learn** and **TensorFlow** to detect phishing URLs and malicious emails.  

### 🏋️‍♂️ Training the Model  
```bash
cd backend
python train_model.py
```
- **URL Features Extracted**: Length, domain age, HTTPS usage, WHOIS data  
- **Email Features Extracted**: Sender reputation, keywords, embedded links  
- **Model Used**: Random Forest & LSTM (for emails)  

---

## 🌐 API Integration  
The system uses **free APIs** to enhance security:  
🔗 **[VirusTotal API](https://www.virustotal.com/gui/home/upload)** – Checks URLs & files for malware.  
🔎 **[Shodan API](https://www.shodan.io/)** – Scans for open ports & vulnerabilities.  
🕵️ **[BreachDirectory API](https://breachdirectory.org/)** – Checks if an email is in data breaches.  

---

## 🖥️ Usage  

1️⃣ **Phishing URL Detection**  
- Upload a list of URLs or use the API:  
```bash
curl -X POST "http://localhost:8000/predict-url" -d '{"url": "http://example.com"}' -H "Content-Type: application/json"
```

2️⃣ **Email Phishing Detection**  
- Analyze email text:  
```bash
curl -X POST "http://localhost:3000/fetch-emails" -d '{"email_text": "Your account is at risk! Click here."}' -H "Content-Type: application/json"
```
Also

http://127.0.0.1:8000/predict/url/

http://127.0.0.1:8000/predict/email/

http://127.0.0.1:5001/predict/text

http://127.0.0.1:5000/check_messages


---

## 🔒 Security Measures  
🔹 **Hashing & Encryption** for sensitive data.  
🔹 **API Key Authentication** for secure API access.  

---

Stay SAFE!!! Stay SECURE!!!
