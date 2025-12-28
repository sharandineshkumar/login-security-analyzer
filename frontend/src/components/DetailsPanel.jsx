import './DetailsPanel.css';

function DetailsPanel({ details }) {
    if (!details) {
        return null;
    }

    const checks = [
        { key: 'has_uppercase', label: 'Uppercase Letters (A-Z)', icon: '🔤' },
        { key: 'has_lowercase', label: 'Lowercase Letters (a-z)', icon: '🔡' },
        { key: 'has_numbers', label: 'Numbers (0-9)', icon: '🔢' },
        { key: 'has_symbols', label: 'Special Characters', icon: '✨' },
    ];

    const warnings = [
        { key: 'is_common', label: 'Common Password', icon: '⚠️', isNegative: true },
        { key: 'has_patterns', label: 'Pattern Detected', icon: '🔄', isNegative: true },
        { key: 'has_repeated', label: 'Repeated Characters', icon: '🔁', isNegative: true },
    ];

    return (
        <div className="details-panel">
            <h3 className="panel-title">
                <span className="title-icon">🔍</span>
                Password Breakdown
            </h3>

            <div className="details-grid">
                {/* Length */}
                <div className="detail-card length-card">
                    <div className="card-icon">📏</div>
                    <div className="card-content">
                        <span className="card-value">{details.length}</span>
                        <span className="card-label">Characters</span>
                    </div>
                    <div className={`card-status ${details.length >= 12 ? 'good' : details.length >= 8 ? 'medium' : 'weak'}`}>
                        {details.length >= 12 ? '✓ Strong' : details.length >= 8 ? '~ OK' : '✗ Short'}
                    </div>
                </div>

                {/* Character Checks */}
                {checks.map(({ key, label, icon }) => (
                    <div key={key} className={`detail-card check-card ${details[key] ? 'passed' : 'failed'}`}>
                        <div className="card-icon">{icon}</div>
                        <div className="card-content">
                            <span className="card-label">{label}</span>
                        </div>
                        <div className="card-status">
                            {details[key] ? '✓' : '✗'}
                        </div>
                    </div>
                ))}
            </div>

            {/* Warnings */}
            {(details.is_common || details.has_patterns || details.has_repeated) && (
                <div className="warnings-section">
                    <h4 className="warnings-title">⚠️ Security Concerns</h4>
                    <div className="warnings-grid">
                        {warnings.map(({ key, label, icon, isNegative }) => (
                            details[key] && (
                                <div key={key} className="warning-card">
                                    <span className="warning-icon">{icon}</span>
                                    <span className="warning-label">{label}</span>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DetailsPanel;
