# 🔐 Login Security Analyzer

A comprehensive security tool to analyze password strength, detect breaches, and help users create secure credentials.

## 🏗️ Project Structure

```
login-security-analyzer/
├── backend/          # Python FastAPI Backend
├── frontend/         # React.js Frontend
└── chrome-extension/ # Chrome Browser Extension
```

## 🚀 Features

- **Password Strength Analysis** - Real-time strength scoring
- **Breach Detection** - Check if password appears in data breaches
- **Pattern Detection** - Identify weak patterns and common passwords
- **Password Generator** - Generate secure random passwords
- **Chrome Extension** - Analyze passwords while browsing

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Python, FastAPI |
| Frontend | React.js, Vite |
| Extension | JavaScript, Chrome APIs |
| API | Have I Been Pwned |

## 📦 Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Chrome Extension
1. Open Chrome → `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `chrome-extension` folder

## 📄 License

MIT License - Feel free to use and modify!
