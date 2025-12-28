/**
 * Login Security Analyzer - Chrome Extension Popup Script
 */

// API Configuration
const API_URL = 'http://localhost:8000';

// DOM Elements
const elements = {
    passwordInput: document.getElementById('passwordInput'),
    toggleVisibility: document.getElementById('toggleVisibility'),
    strengthSection: document.getElementById('strengthSection'),
    strengthValue: document.getElementById('strengthValue'),
    strengthBar: document.getElementById('strengthBar'),
    scoreValue: document.getElementById('scoreValue'),
    breachSection: document.getElementById('breachSection'),
    breachAlert: document.getElementById('breachAlert'),
    breachIcon: document.getElementById('breachIcon'),
    breachTitle: document.getElementById('breachTitle'),
    breachMessage: document.getElementById('breachMessage'),
    feedbackSection: document.getElementById('feedbackSection'),
    feedbackList: document.getElementById('feedbackList'),
    generateBtn: document.getElementById('generateBtn'),
    generatedPassword: document.getElementById('generatedPassword'),
    passwordDisplay: document.getElementById('passwordDisplay'),
    copyBtn: document.getElementById('copyBtn'),
    useBtn: document.getElementById('useBtn'),
    openDashboard: document.getElementById('openDashboard'),
    settingsBtn: document.getElementById('settingsBtn'),
};

// State
let currentPassword = '';
let debounceTimer = null;

// ==================== Password Analysis ====================

async function analyzePassword(password) {
    if (!password) {
        hideResults();
        return;
    }

    try {
        // Try to call the backend API
        const response = await fetch(`${API_URL}/api/full-analysis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });

        if (!response.ok) throw new Error('API unavailable');

        const result = await response.json();
        displayResults(result);
    } catch (error) {
        // Fallback to client-side analysis
        console.log('Using client-side analysis (backend unavailable)');
        const result = clientSideAnalysis(password);
        displayResults(result);
    }
}

function clientSideAnalysis(password) {
    let score = 0;
    const feedback = [];
    const suggestions = [];

    // Length check
    if (password.length >= 12) score += 25;
    else if (password.length >= 8) score += 15;
    else suggestions.push('Use at least 8 characters');

    // Character checks
    if (/[A-Z]/.test(password)) score += 20;
    else suggestions.push('Add uppercase letters (A-Z)');

    if (/[a-z]/.test(password)) score += 15;
    else suggestions.push('Add lowercase letters (a-z)');

    if (/\d/.test(password)) score += 20;
    else suggestions.push('Add numbers (0-9)');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;
    else suggestions.push('Add special characters');

    // Common passwords
    const common = ['password', '123456', 'qwerty', 'admin', 'letmein'];
    if (common.includes(password.toLowerCase())) {
        score = Math.max(5, score - 50);
        feedback.push('This is a commonly used password!');
    }

    score = Math.min(100, score);

    let strength, color;
    if (score >= 80) { strength = 'Strong'; color = '#22c55e'; }
    else if (score >= 60) { strength = 'Good'; color = '#84cc16'; }
    else if (score >= 40) { strength = 'Medium'; color = '#eab308'; }
    else { strength = 'Weak'; color = '#ef4444'; }

    return {
        score,
        strength,
        strength_color: color,
        feedback: feedback.length ? feedback : ['Analyzing...'],
        suggestions,
        breached: false,
        breach_count: 0,
        breach_message: 'Breach check requires backend connection',
    };
}

// ==================== Display Functions ====================

function displayResults(result) {
    // Show strength section
    elements.strengthSection.style.display = 'block';
    elements.strengthValue.textContent = result.strength;
    elements.strengthValue.style.color = result.strength_color;
    elements.strengthBar.style.width = `${result.score}%`;
    elements.strengthBar.style.background = result.strength_color;
    elements.scoreValue.textContent = result.score;

    // Show breach section
    elements.breachSection.style.display = 'block';
    if (result.breached) {
        elements.breachAlert.className = 'breach-alert danger';
        elements.breachIcon.textContent = '🚨';
        elements.breachTitle.textContent = 'Password Compromised!';
        elements.breachMessage.textContent = `Found in ${result.breach_count.toLocaleString()} data breaches`;
    } else {
        elements.breachAlert.className = 'breach-alert safe';
        elements.breachIcon.textContent = '✅';
        elements.breachTitle.textContent = 'No Breaches Found';
        elements.breachMessage.textContent = result.breach_message || 'Password not found in known breaches';
    }

    // Show feedback/suggestions
    const items = [...(result.suggestions || [])];
    if (items.length > 0) {
        elements.feedbackSection.style.display = 'block';
        elements.feedbackList.innerHTML = items
            .map(item => `<li>${item}</li>`)
            .join('');
    } else {
        elements.feedbackSection.style.display = 'none';
    }
}

function hideResults() {
    elements.strengthSection.style.display = 'none';
    elements.breachSection.style.display = 'none';
    elements.feedbackSection.style.display = 'none';
}

// ==================== Password Generator ====================

async function generateSecurePassword() {
    const options = {
        length: 16,
        include_uppercase: true,
        include_lowercase: true,
        include_numbers: true,
        include_symbols: true,
        exclude_ambiguous: true,
    };

    try {
        const response = await fetch(`${API_URL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(options),
        });

        if (!response.ok) throw new Error('API unavailable');

        const result = await response.json();
        return result.password;
    } catch (error) {
        // Fallback client-side generation
        return generateClientSidePassword(options);
    }
}

function generateClientSidePassword(options) {
    let charset = '';
    if (options.include_uppercase) charset += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    if (options.include_lowercase) charset += 'abcdefghjkmnpqrstuvwxyz';
    if (options.include_numbers) charset += '23456789';
    if (options.include_symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let password = '';
    const array = new Uint32Array(options.length);
    crypto.getRandomValues(array);

    for (let i = 0; i < options.length; i++) {
        password += charset[array[i] % charset.length];
    }

    return password;
}

async function handleGenerate() {
    elements.generateBtn.disabled = true;
    elements.generateBtn.innerHTML = '<span class="btn-icon">⏳</span> Generating...';

    const password = await generateSecurePassword();

    elements.passwordDisplay.textContent = password;
    elements.generatedPassword.style.display = 'block';

    elements.generateBtn.disabled = false;
    elements.generateBtn.innerHTML = '<span class="btn-icon">🎲</span> Generate Secure Password';
}

// ==================== Event Handlers ====================

// Password input with debounce
elements.passwordInput.addEventListener('input', (e) => {
    currentPassword = e.target.value;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        analyzePassword(currentPassword);
    }, 300);
});

// Toggle password visibility
elements.toggleVisibility.addEventListener('click', () => {
    const isPassword = elements.passwordInput.type === 'password';
    elements.passwordInput.type = isPassword ? 'text' : 'password';
    elements.toggleVisibility.textContent = isPassword ? '🙈' : '👁️';
});

// Generate password
elements.generateBtn.addEventListener('click', handleGenerate);

// Copy generated password
elements.copyBtn.addEventListener('click', async () => {
    const password = elements.passwordDisplay.textContent;
    await navigator.clipboard.writeText(password);
    elements.copyBtn.textContent = '✓';
    setTimeout(() => {
        elements.copyBtn.textContent = '📋';
    }, 1500);
});

// Use generated password (analyze it)
elements.useBtn.addEventListener('click', () => {
    const password = elements.passwordDisplay.textContent;
    elements.passwordInput.value = password;
    elements.passwordInput.type = 'text';
    elements.toggleVisibility.textContent = '🙈';
    analyzePassword(password);
});

// Open dashboard (placeholder)
elements.openDashboard.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'http://localhost:5173' });
});

// Settings button (placeholder)
elements.settingsBtn.addEventListener('click', () => {
    alert('Settings coming soon!');
});

// Focus input on popup open
window.addEventListener('load', () => {
    elements.passwordInput.focus();
});
