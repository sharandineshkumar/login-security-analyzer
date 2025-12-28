/**
 * Login Security Analyzer - Content Script
 * Runs on all web pages to detect and analyze password fields
 */

// Configuration
const CONFIG = {
    API_URL: 'http://localhost:8000',
    DEBOUNCE_DELAY: 500,
    MIN_PASSWORD_LENGTH: 4,
};

// Track password fields
const analyzedFields = new WeakMap();
let debounceTimers = new Map();

// ==================== Password Field Detection ====================

function findPasswordFields() {
    const passwordFields = document.querySelectorAll('input[type="password"]');

    passwordFields.forEach((field) => {
        if (!analyzedFields.has(field)) {
            attachPasswordAnalyzer(field);
            analyzedFields.set(field, true);
        }
    });
}

function attachPasswordAnalyzer(field) {
    // Create indicator element
    const indicator = createIndicator();

    // Position indicator near the field
    field.parentElement.style.position = 'relative';

    // Add input listener
    field.addEventListener('input', (e) => {
        handlePasswordInput(e.target, indicator);
    });

    // Add focus listener to show indicator
    field.addEventListener('focus', () => {
        if (field.value.length >= CONFIG.MIN_PASSWORD_LENGTH) {
            showIndicator(field, indicator);
        }
    });

    // Add blur listener to hide indicator
    field.addEventListener('blur', () => {
        setTimeout(() => {
            hideIndicator(indicator);
        }, 200);
    });
}

// ==================== UI Elements ====================

function createIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'lsa-indicator';
    indicator.innerHTML = `
    <div class="lsa-indicator-content">
      <span class="lsa-icon">🔐</span>
      <span class="lsa-strength">-</span>
      <div class="lsa-bar"><div class="lsa-bar-fill"></div></div>
    </div>
  `;
    indicator.style.display = 'none';
    document.body.appendChild(indicator);
    return indicator;
}

function showIndicator(field, indicator) {
    const rect = field.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    indicator.style.display = 'block';
    indicator.style.top = `${rect.bottom + scrollTop + 5}px`;
    indicator.style.left = `${rect.left + scrollLeft}px`;
    indicator.style.width = `${Math.min(rect.width, 300)}px`;
}

function hideIndicator(indicator) {
    indicator.style.display = 'none';
}

function updateIndicator(indicator, result) {
    const strength = indicator.querySelector('.lsa-strength');
    const barFill = indicator.querySelector('.lsa-bar-fill');

    strength.textContent = result.strength;
    strength.style.color = result.strength_color;
    barFill.style.width = `${result.score}%`;
    barFill.style.background = result.strength_color;

    // Add breach warning
    if (result.breached) {
        indicator.classList.add('lsa-breached');
        strength.textContent = '⚠️ BREACHED!';
        strength.style.color = '#ef4444';
    } else {
        indicator.classList.remove('lsa-breached');
    }
}

// ==================== Password Analysis ====================

function handlePasswordInput(field, indicator) {
    const password = field.value;
    const fieldId = field.id || field.name || 'default';

    // Clear existing timer
    if (debounceTimers.has(fieldId)) {
        clearTimeout(debounceTimers.get(fieldId));
    }

    if (password.length < CONFIG.MIN_PASSWORD_LENGTH) {
        hideIndicator(indicator);
        return;
    }

    showIndicator(field, indicator);

    // Set new timer
    debounceTimers.set(fieldId, setTimeout(async () => {
        const result = await analyzePassword(password);
        updateIndicator(indicator, result);
    }, CONFIG.DEBOUNCE_DELAY));
}

async function analyzePassword(password) {
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/full-analysis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });

        if (!response.ok) throw new Error('API unavailable');

        return await response.json();
    } catch (error) {
        // Fallback to client-side analysis
        return clientSideAnalysis(password);
    }
}

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

    return { score, strength, strength_color: color, breached: false };
}

// ==================== Initialization ====================

// Initial scan
findPasswordFields();

// Watch for new password fields (for SPAs)
const observer = new MutationObserver(() => {
    findPasswordFields();
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});

// Log initialization
console.log('🔐 Login Security Analyzer - Content script loaded');
