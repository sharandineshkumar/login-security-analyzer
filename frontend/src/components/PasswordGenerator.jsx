import { useState } from 'react';
import { generatePassword } from '../services/api';
import './PasswordGenerator.css';

function PasswordGenerator({ onGenerate }) {
    const [loading, setLoading] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [copied, setCopied] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Generator options
    const [options, setOptions] = useState({
        length: 16,
        include_uppercase: true,
        include_lowercase: true,
        include_numbers: true,
        include_symbols: true,
        exclude_ambiguous: true,
    });

    const handleGenerate = async () => {
        setLoading(true);
        setCopied(false);

        try {
            const result = await generatePassword(options);
            setGeneratedPassword(result.password);
            onGenerate(result.password);
        } catch (error) {
            console.error('Generate error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        if (generatedPassword) {
            await navigator.clipboard.writeText(generatedPassword);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleUse = () => {
        if (generatedPassword) {
            onGenerate(generatedPassword);
        }
    };

    const handleOptionChange = (key, value) => {
        setOptions(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="password-generator">
            <button
                className="generator-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className="toggle-icon">🎲</span>
                <span className="toggle-text">Password Generator</span>
                <span className={`toggle-arrow ${isOpen ? 'open' : ''}`}>▼</span>
            </button>

            {isOpen && (
                <div className="generator-content">
                    <div className="generator-options">
                        <div className="option-row">
                            <label className="option-label">Length</label>
                            <div className="length-control">
                                <input
                                    type="range"
                                    min="8"
                                    max="64"
                                    value={options.length}
                                    onChange={(e) => handleOptionChange('length', parseInt(e.target.value))}
                                    className="length-slider"
                                />
                                <span className="length-value">{options.length}</span>
                            </div>
                        </div>

                        <div className="options-grid">
                            {[
                                { key: 'include_uppercase', label: 'A-Z', title: 'Uppercase' },
                                { key: 'include_lowercase', label: 'a-z', title: 'Lowercase' },
                                { key: 'include_numbers', label: '0-9', title: 'Numbers' },
                                { key: 'include_symbols', label: '@#$', title: 'Symbols' },
                            ].map(({ key, label, title }) => (
                                <button
                                    key={key}
                                    className={`option-btn ${options[key] ? 'active' : ''}`}
                                    onClick={() => handleOptionChange(key, !options[key])}
                                    title={title}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        className="generate-btn"
                        onClick={handleGenerate}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="btn-icon">⏳</span>
                                Generating...
                            </>
                        ) : (
                            <>
                                <span className="btn-icon">🎲</span>
                                Generate Secure Password
                            </>
                        )}
                    </button>

                    {generatedPassword && (
                        <div className="generated-result">
                            <div className="result-password">
                                <code>{generatedPassword}</code>
                            </div>
                            <div className="result-actions">
                                <button
                                    className="result-btn copy-btn"
                                    onClick={handleCopy}
                                >
                                    {copied ? '✓ Copied!' : '📋 Copy'}
                                </button>
                                <button
                                    className="result-btn use-btn"
                                    onClick={handleUse}
                                >
                                    📝 Analyze
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default PasswordGenerator;
