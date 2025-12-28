/**
 * Login Security Analyzer - Background Service Worker
 * Handles extension lifecycle and cross-context communication
 */

// Extension installation
chrome.runtime.onInstalled.addListener((details) => {
    console.log('🔐 Login Security Analyzer installed!', details.reason);

    // Set default settings
    chrome.storage.local.set({
        settings: {
            autoAnalyze: true,
            showIndicators: true,
            checkBreaches: true,
            apiUrl: 'http://localhost:8000',
        },
    });
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'ANALYZE_PASSWORD':
            handleAnalyzePassword(message.password)
                .then(sendResponse)
                .catch((error) => sendResponse({ error: error.message }));
            return true; // Indicates async response

        case 'GET_SETTINGS':
            chrome.storage.local.get('settings', (data) => {
                sendResponse(data.settings);
            });
            return true;

        case 'UPDATE_SETTINGS':
            chrome.storage.local.set({ settings: message.settings }, () => {
                sendResponse({ success: true });
            });
            return true;

        default:
            console.log('Unknown message type:', message.type);
    }
});

// Analyze password via API
async function handleAnalyzePassword(password) {
    const { settings } = await chrome.storage.local.get('settings');
    const apiUrl = settings?.apiUrl || 'http://localhost:8000';

    try {
        const response = await fetch(`${apiUrl}/api/full-analysis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        return await response.json();
    } catch (error) {
        // Return basic client-side analysis
        return clientSideAnalysis(password);
    }
}

// Fallback client-side analysis
function clientSideAnalysis(password) {
    let score = 0;

    if (password.length >= 12) score += 25;
    else if (password.length >= 8) score += 15;

    if (/[A-Z]/.test(password)) score += 20;
    if (/[a-z]/.test(password)) score += 15;
    if (/\d/.test(password)) score += 20;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;

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
        feedback: [],
        suggestions: [],
        breached: false,
        breach_count: 0,
        breach_message: 'Offline analysis',
    };
}

// Log service worker start
console.log('🔐 Login Security Analyzer - Service worker started');
