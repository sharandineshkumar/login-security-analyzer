---
description: Complete overview of the Login Security Analyzer project for reference
---

# 🔐 Login Security Analyzer - Project Overview

## Project Summary
A comprehensive **full-stack password security application** that helps users analyze password strength, check for data breaches, and generate secure passwords.

## Tech Stack

### Frontend (React.js)
- **Framework:** React.js with Vite
- **Styling:** Vanilla CSS with CSS Variables
- **Fonts:** Plus Jakarta Sans, DM Sans, Space Mono (Apple/Nike style)
- **Port:** http://localhost:5173

### Backend (Python FastAPI)
- **Framework:** FastAPI
- **Server:** Uvicorn
- **External API:** Have I Been Pwned (HIBP) for breach detection
- **Port:** http://localhost:8000

### Chrome Extension
- **Manifest:** Version 3
- **Features:** Popup analyzer, content script for password field detection

---

## Project Structure

```
Main project/
├── README.md
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── requirements.txt
│   └── app/
│       ├── __init__.py
│       ├── main.py              # FastAPI endpoints
│       └── services/
│           ├── __init__.py
│           ├── password_analyzer.py   # Strength analysis logic
│           ├── breach_checker.py      # HIBP API integration
│           └── password_generator.py  # Secure password generation
├── frontend/
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── public/
│   │   └── favicon.svg
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── components/
│       │   ├── Header.jsx/.css
│       │   ├── PasswordInput.jsx/.css
│       │   ├── StrengthMeter.jsx/.css
│       │   ├── FeedbackPanel.jsx/.css
│       │   ├── BreachAlert.jsx/.css
│       │   ├── DetailsPanel.jsx/.css
│       │   ├── PasswordGenerator.jsx/.css
│       │   ├── MemorableGenerator.jsx/.css    # NEW
│       │   └── DarkWebMonitor.jsx/.css        # NEW
│       ├── services/
│       │   └── api.js
│       └── styles/
│           ├── index.css
│           └── App.css
└── chrome-extension/
    ├── manifest.json
    ├── popup/
    │   ├── popup.html
    │   ├── popup.css
    │   └── popup.js
    ├── content/
    │   ├── content.js
    │   └── content.css
    ├── background/
    │   └── background.js
    └── icons/
        └── README.md
```

---

## Key Features

### 1. Password Strength Analysis
- Real-time analysis as user types
- Score out of 100
- Strength levels: Weak, Medium, Good, Strong
- Visual progress bar with colors

### 2. Breach Detection (HIBP API)
- Uses k-anonymity for privacy
- Checks against 700M+ leaked passwords
- Shows breach count if compromised

### 3. Feedback & Suggestions
- Lists specific issues with password
- Provides improvement suggestions
- Detects common patterns (keyboard, sequential)

### 4. Password Generator
- Customizable length (8-64 characters)
- Toggle: uppercase, lowercase, numbers, symbols
- Exclude ambiguous characters option

### 5. 🧠 AI Memorable Password Generator (UNIQUE FEATURE)
- 3 styles: Phrase, Story, Pattern
- Generates passwords like: "Brave-Tiger-42!"
- Provides memory tricks with visual stories
- Emoji visualization for easy recall

### 6. 🌐 Dark Web Monitor (UNIQUE FEATURE)
- Animated scanning progress bar
- Checks multiple sources (5 databases)
- Real-time status updates per source
- Visual safe/danger results

### 7. Chrome Extension
- Popup for quick password checking
- Content script detects password fields on any website
- Shows inline strength indicators

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze` | POST | Analyze password strength |
| `/api/breach-check` | POST | Check password in breaches |
| `/api/full-analysis` | POST | Combined strength + breach check |
| `/api/generate` | POST | Generate secure password |
| `/api/health` | GET | Health check |

---

## How to Run

### Backend:
```powershell
cd "c:\Users\saran\OneDrive\Desktop\Main project\backend"
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend:
```powershell
cd "c:\Users\saran\OneDrive\Desktop\Main project\frontend"
npm run dev
```

### Chrome Extension:
1. Go to chrome://extensions
2. Enable Developer Mode
3. Click "Load unpacked"
4. Select the chrome-extension folder

---

## Key Files Reference

### Password Analysis Logic
- `backend/app/services/password_analyzer.py` - Core scoring algorithm

### Breach Checking
- `backend/app/services/breach_checker.py` - HIBP API with k-anonymity

### Frontend State Management
- `frontend/src/App.jsx` - Main state and API calls

### Styling System
- `frontend/src/styles/index.css` - CSS variables and design tokens

### Font Configuration
- Fonts imported in `frontend/index.html`
- Variables defined in `frontend/src/styles/index.css`:
  - `--font-family`: DM Sans
  - `--font-heading`: Plus Jakarta Sans
  - `--font-mono`: Space Mono

---

## Target Audience

1. **Everyday Users** - Check personal password security
2. **Professionals** - Meet workplace password policies
3. **Organizations** - Security training tool
4. **Developers** - Learn security APIs
5. **Students** - Cybersecurity education

---

## Unique Value Propositions

1. **Breach Detection** - Most sites don't check this
2. **Pre-Signup Testing** - Check passwords before creating accounts
3. **AI Memorable Passwords** - Unique feature with memory tricks
4. **Dark Web Monitor** - Visual, animated breach scanning
5. **All-in-One** - Combines multiple security tools

---

## Dependencies

### Backend (requirements.txt):
- fastapi
- uvicorn[standard]
- httpx
- pydantic
- python-dotenv

### Frontend (package.json):
- react
- react-dom
- @vitejs/plugin-react
- vite

---

## Notes for Future Development

- Consider adding email breach check
- Password history tracking
- Export security reports
- Multi-language support
- User accounts for saving analysis
