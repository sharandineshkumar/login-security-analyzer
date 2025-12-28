import './BreachAlert.css';

function BreachAlert({ breached, breachCount, message }) {
    if (!breached) {
        return (
            <div className="breach-alert breach-safe">
                <div className="alert-icon">✅</div>
                <div className="alert-content">
                    <h4 className="alert-title">No Breaches Found</h4>
                    <p className="alert-message">{message || 'This password was not found in any known data breaches.'}</p>
                </div>
            </div>
        );
    }

    const getSeverity = () => {
        if (breachCount >= 100000) return 'critical';
        if (breachCount >= 10000) return 'high';
        if (breachCount >= 1000) return 'medium';
        return 'low';
    };

    return (
        <div className={`breach-alert breach-danger severity-${getSeverity()}`}>
            <div className="alert-icon-container">
                <div className="alert-icon">🚨</div>
                <div className="alert-pulse"></div>
            </div>

            <div className="alert-content">
                <h4 className="alert-title">
                    Password Compromised!
                </h4>
                <p className="alert-message">{message}</p>

                <div className="breach-stats">
                    <div className="stat">
                        <span className="stat-value">{breachCount.toLocaleString()}</span>
                        <span className="stat-label">times exposed</span>
                    </div>
                </div>

                <div className="alert-actions">
                    <a
                        href="https://haveibeenpwned.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="alert-link"
                    >
                        Learn more at Have I Been Pwned →
                    </a>
                </div>
            </div>
        </div>
    );
}

export default BreachAlert;
