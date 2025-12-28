import './StrengthMeter.css';

function StrengthMeter({ score, strength, strengthColor }) {
    const getEmoji = () => {
        if (score >= 80) return '💪';
        if (score >= 60) return '👍';
        if (score >= 40) return '🤔';
        if (score >= 20) return '😟';
        if (score > 0) return '😰';
        return '🔒';
    };

    return (
        <div className="strength-meter">
            <div className="meter-header">
                <span className="meter-label">Password Strength</span>
                <div className="meter-result">
                    <span className="result-emoji">{getEmoji()}</span>
                    <span
                        className="result-text"
                        style={{ color: strengthColor }}
                    >
                        {strength}
                    </span>
                    <span className="result-score">{score}/100</span>
                </div>
            </div>

            <div className="meter-bar-container">
                <div
                    className="meter-bar"
                    style={{
                        width: `${score}%`,
                        background: strengthColor
                    }}
                />
                <div className="meter-segments">
                    <span className="segment" />
                    <span className="segment" />
                    <span className="segment" />
                    <span className="segment" />
                </div>
            </div>

            <div className="meter-legend">
                <span className="legend-item">
                    <span className="legend-dot" style={{ background: 'var(--color-very-weak)' }}></span>
                    Weak
                </span>
                <span className="legend-item">
                    <span className="legend-dot" style={{ background: 'var(--color-medium)' }}></span>
                    Medium
                </span>
                <span className="legend-item">
                    <span className="legend-dot" style={{ background: 'var(--color-good)' }}></span>
                    Good
                </span>
                <span className="legend-item">
                    <span className="legend-dot" style={{ background: 'var(--color-strong)' }}></span>
                    Strong
                </span>
            </div>
        </div>
    );
}

export default StrengthMeter;
