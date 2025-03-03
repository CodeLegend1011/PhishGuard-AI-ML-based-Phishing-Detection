# 🛡️ AI-Powered Phishing Detection System 🚀

## 📌 Overview  
The **AI-Powered Phishing Detection System** is a project designed to identify phishing URLs, detect email phishing scams. Using **Machine Learning (ML)** and **Threat Intelligence APIs**, this system enhances cybersecurity by detecting threats in real time.

## 🌟 Features  
✅ **Phishing URL Detection**: Classifies URLs as **benign, phishing, malware, or defacement** using ML.  
✅ **Email Phishing Scam Detection**: Analyzes email content to identify phishing attempts.  
✅ **Threat Intelligence API Integration**: Uses **VirusTotal, Shodan, BreachDirectory** for enhanced security insights.  
✅ **Real-time Monitoring Dashboard**: A **MERN Stack web app** to visualize security threats.  

---

## 🖼️ Screenshots & Visuals  

Here are some visuals showcasing the key components of the phishing detection system:  

### 🏠 Landing Page  
> **Description**: The main entry point of the platform.  
<p align="center">
  <img src="https://github.com/user-attachments/assets/1e30f75e-436f-4bb9-bd5a-0158b7cb08f5" alt="Landing Page" width="600"/>
</p>

### 🔑 Login Page  
> **Description**: Secure authentication system for users.  
<p align="center">
  <img src="https://github.com/user-attachments/assets/18275ac4-fd67-4c06-93d9-4fdd571c1b15" alt="Login Page" width="600"/>
</p>

### 🎯 Phishing Detection Dashboard  
> **Description**: The main dashboard displaying detection results and analytics.  
<p align="center">
  <img src="https://github.com/user-attachments/assets/2f4ea95d-5fa0-48a8-ab1c-5bb0b39368e1" alt="Dashboard" width="600"/>
</p>

### 🔍 Email, SMS, URL Phishing Detection Result  
> **Description**: System detecting and classifying URLs as phishing or safe.  
<p align="center">
  <img src="https://github.com/user-attachments/assets/71a40aa4-be1e-4cf5-9966-8c612ca6890d" alt="Phishing Detection Result" width="600"/>
</p>

### 📩 Telegram Message Integration  
> **Description**: The system alerts users about phishing threats via Telegram.  
<p align="center">
  <img src="https://github.com/user-attachments/assets/3ba259e3-0af0-483b-8ba8-bc37f0c32eb6" alt="Telegram Alerts" width="600"/>
</p>

### 🤖 AI Chatbot for Phishing Assistance  
> **Description**: A chatbot that helps analyze and detect phishing threats.  
<p align="center">
  <img src="https://github.com/user-attachments/assets/86a2a807-bc17-4e0a-ac16-3e9dfaf8ab60" alt="AI Chatbot" width="600"/>
</p>

### 📧 Email Phishing Detection Example  
> **Description**: Detection of phishing emails using AI models.  
<p align="center">
  <img src="https://github.com/user-attachments/assets/f9d91a93-2b0f-4c3e-bc1e-de00bd0ec15a" alt="Email Phishing Detection" width="600"/>
</p>


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
