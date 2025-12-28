import { useState } from 'react';
import './PasswordInput.css';

function PasswordInput({ value, onChange, loading }) {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (e) => {
        onChange(e.target.value);
    };

    const toggleVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleClear = () => {
        onChange('');
    };

    return (
        <div className={`password-input-container ${isFocused ? 'focused' : ''} ${loading ? 'loading' : ''}`}>
            <label htmlFor="password-input" className="input-label">
                Enter Password to Analyze
            </label>

            <div className="input-wrapper">
                <span className="input-icon">🔑</span>

                <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Type your password here..."
                    autoComplete="new-password"
                    spellCheck="false"
                    className="password-input"
                />

                <div className="input-actions">
                    {value && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="action-btn clear-btn"
                            title="Clear password"
                            aria-label="Clear password"
                        >
                            ✕
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={toggleVisibility}
                        className="action-btn toggle-btn"
                        title={showPassword ? 'Hide password' : 'Show password'}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? '🙈' : '👁️'}
                    </button>
                </div>

                {loading && (
                    <div className="loading-indicator">
                        <span className="loading-dot"></span>
                        <span className="loading-dot"></span>
                        <span className="loading-dot"></span>
                    </div>
                )}
            </div>

            <div className="input-footer">
                <span className="char-count">{value.length} characters</span>
                {value.length > 0 && value.length < 8 && (
                    <span className="length-warning">Minimum 8 recommended</span>
                )}
            </div>
        </div>
    );
}

export default PasswordInput;
