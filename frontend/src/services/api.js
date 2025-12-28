/**
 * API Service
 * Handles all communication with the Python backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Debounce helper
let debounceTimer;
const debounce = (func, delay) => {
    return (...args) => {
        clearTimeout(debounceTimer);
        return new Promise((resolve) => {
            debounceTimer = setTimeout(async () => {
                const result = await func(...args);
                resolve(result);
            }, delay);
        });
    };
};

/**
 * Perform full password analysis (strength + breach check)
 */
export async function analyzePassword(password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/full-analysis`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Analyze password strength only (no breach check)
 */
export async function analyzeStrengthOnly(password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Check if password appears in data breaches
 */
export async function checkBreach(password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/breach-check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Generate a secure random password
 */
export async function generatePassword(options = {}) {
    const defaultOptions = {
        length: 16,
        include_uppercase: true,
        include_lowercase: true,
        include_numbers: true,
        include_symbols: true,
        exclude_ambiguous: true,
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
        const response = await fetch(`${API_BASE_URL}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(finalOptions),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        // Fallback to client-side generation
        return {
            password: generateClientSidePassword(finalOptions),
            score: 90,
            strength: 'Strong'
        };
    }
}

/**
 * Fallback client-side password generator
 */
function generateClientSidePassword(options) {
    const { length, include_uppercase, include_lowercase, include_numbers, include_symbols, exclude_ambiguous } = options;

    let charset = '';
    if (include_uppercase) charset += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    if (include_lowercase) charset += 'abcdefghjkmnpqrstuvwxyz';
    if (include_numbers) charset += '23456789';
    if (include_symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) charset = 'abcdefghjkmnpqrstuvwxyz';

    let password = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
        password += charset[array[i] % charset.length];
    }

    return password;
}

/**
 * Check API health
 */
export async function checkHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        return response.ok;
    } catch {
        return false;
    }
}
