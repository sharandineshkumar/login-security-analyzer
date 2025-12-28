import { useState, useCallback } from 'react';
import Header from './components/Header';
import PasswordInput from './components/PasswordInput';
import StrengthMeter from './components/StrengthMeter';
import FeedbackPanel from './components/FeedbackPanel';
import BreachAlert from './components/BreachAlert';
import PasswordGenerator from './components/PasswordGenerator';
import DetailsPanel from './components/DetailsPanel';
import MemorableGenerator from './components/MemorableGenerator';
import DarkWebMonitor from './components/DarkWebMonitor';
import { analyzePassword } from './services/api';
import './styles/App.css';

function App() {
    const [password, setPassword] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Debounced password analysis
    const handlePasswordChange = useCallback(async (newPassword) => {
        setPassword(newPassword);
        setError(null);

        if (!newPassword) {
            setAnalysis(null);
            return;
        }

        // Only analyze if password is at least 1 character
        if (newPassword.length > 0) {
            setLoading(true);
            try {
                const result = await analyzePassword(newPassword);
                setAnalysis(result);
            } catch (err) {
                setError('Could not analyze password. Backend may be offline.');
                // Fallback to client-side analysis
                setAnalysis(clientSideAnalysis(newPassword));
            } finally {
                setLoading(false);
            }
        }
    }, []);

    // Handle generated password
    const handleGeneratedPassword = (generatedPassword) => {
        handlePasswordChange(generatedPassword);
    };

    return (
        <div className="app">
            <div className="background-effects">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <div className="container">
                <Header />

                <main className="main-content">
                    <div className="analyzer-section">
                        <PasswordInput
                            value={password}
                            onChange={handlePasswordChange}
                            loading={loading}
                        />

                        {error && (
                            <div className="error-message">
                                <span className="error-icon">⚠️</span>
                                {error}
                            </div>
                        )}

                        <StrengthMeter
                            score={analysis?.score || 0}
                            strength={analysis?.strength || 'None'}
                            strengthColor={analysis?.strength_color || '#6b7280'}
                        />

                        {analysis?.breached && (
                            <BreachAlert
                                breached={analysis.breached}
                                breachCount={analysis.breach_count}
                                message={analysis.breach_message}
                            />
                        )}

                        <FeedbackPanel
                            feedback={analysis?.feedback || []}
                            suggestions={analysis?.suggestions || []}
                        />

                        <DetailsPanel
                            details={analysis?.details}
                        />
                    </div>

                    <div className="generator-section">
                        <PasswordGenerator
                            onGenerate={handleGeneratedPassword}
                        />

                        <MemorableGenerator
                            onGenerate={handleGeneratedPassword}
                        />

                        <DarkWebMonitor
                            password={password}
                            breached={analysis?.breached || false}
                            breachCount={analysis?.breach_count || 0}
                        />
                    </div>
                </main>

                <footer className="footer">
                    <p>🔐 Login Security Analyzer</p>
                    <p className="footer-note">Your password never leaves your browser unencrypted.</p>
                </footer>
            </div>
        </div>
    );
}

// Fallback client-side analysis when API is unavailable
function clientSideAnalysis(password) {
    let score = 0;
    const feedback = [];
    const suggestions = [];

    // Length
    if (password.length >= 12) score += 25;
    else if (password.length >= 8) score += 15;
    else {
        feedback.push("Password is too short");
        suggestions.push("Use at least 8 characters");
    }

    // Character checks
    if (/[A-Z]/.test(password)) score += 20;
    else suggestions.push("Add uppercase letters");

    if (/[a-z]/.test(password)) score += 15;
    else suggestions.push("Add lowercase letters");

    if (/\d/.test(password)) score += 20;
    else suggestions.push("Add numbers");

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;
    else suggestions.push("Add special characters");

    const strength = score >= 80 ? 'Strong' : score >= 60 ? 'Good' : score >= 40 ? 'Medium' : 'Weak';
    const colors = { Strong: '#22c55e', Good: '#84cc16', Medium: '#eab308', Weak: '#ef4444' };

    return {
        score: Math.min(100, score),
        strength,
        strength_color: colors[strength] || '#6b7280',
        feedback: feedback.length ? feedback : ['✅ Looking good!'],
        suggestions,
        breached: false,
        breach_count: 0,
        breach_message: '',
        details: {
            length: password.length,
            has_uppercase: /[A-Z]/.test(password),
            has_lowercase: /[a-z]/.test(password),
            has_numbers: /\d/.test(password),
            has_symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        }
    };
}

export default App;
