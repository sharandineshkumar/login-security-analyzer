import './FeedbackPanel.css';

function FeedbackPanel({ feedback, suggestions }) {
    if (!feedback.length && !suggestions.length) {
        return null;
    }

    const getIcon = (text) => {
        if (text.includes('✅') || text.includes('Great') || text.includes('Good')) {
            return '✅';
        }
        if (text.includes('⚠️') || text.includes('commonly')) {
            return '🚨';
        }
        return '⚠️';
    };

    return (
        <div className="feedback-panel">
            {feedback.length > 0 && (
                <div className="feedback-section">
                    <h3 className="section-title">
                        <span className="title-icon">📋</span>
                        Analysis Results
                    </h3>
                    <ul className="feedback-list">
                        {feedback.map((item, index) => (
                            <li key={index} className="feedback-item">
                                <span className="item-icon">{getIcon(item)}</span>
                                <span className="item-text">{item.replace(/^(✅|⚠️|🚨)\s*/, '')}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {suggestions.length > 0 && (
                <div className="suggestions-section">
                    <h3 className="section-title">
                        <span className="title-icon">💡</span>
                        Suggestions
                    </h3>
                    <ul className="suggestions-list">
                        {suggestions.map((item, index) => (
                            <li key={index} className="suggestion-item">
                                <span className="item-icon">→</span>
                                <span className="item-text">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default FeedbackPanel;
