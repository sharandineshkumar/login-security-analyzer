import { useState, useEffect, useRef } from 'react';
import './DarkWebMonitor.css';

function DarkWebMonitor({ password, breached, breachCount }) {
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [scanStage, setScanStage] = useState('');
    const [scanComplete, setScanComplete] = useState(false);
    const [sources, setSources] = useState([
        { name: 'Have I Been Pwned', count: '700M+', status: 'pending', icon: '🔍' },
        { name: 'Common Password Lists', count: '10M+', status: 'pending', icon: '📋' },
        { name: 'Recent Breach Databases', count: '2024', status: 'pending', icon: '🗄️' },
        { name: 'Dark Web Forums', count: 'Live', status: 'pending', icon: '🌐' },
        { name: 'Leaked Credential Dumps', count: '500M+', status: 'pending', icon: '💾' }
    ]);
    const scanInterval = useRef(null);

    const scanStages = [
        'Initializing secure connection...',
        'Connecting to breach databases...',
        'Scanning Have I Been Pwned...',
        'Checking common password lists...',
        'Analyzing recent breaches...',
        'Scanning dark web sources...',
        'Checking credential dumps...',
        'Compiling results...',
        'Scan complete!'
    ];

    const startScan = () => {
        if (isScanning) return;

        setIsScanning(true);
        setScanComplete(false);
        setScanProgress(0);
        setScanStage(scanStages[0]);

        // Reset sources
        setSources(prev => prev.map(s => ({ ...s, status: 'pending' })));

        let progress = 0;
        let stageIndex = 0;
        let sourceIndex = 0;

        scanInterval.current = setInterval(() => {
            progress += Math.random() * 8 + 2;

            if (progress >= 100) {
                progress = 100;
                clearInterval(scanInterval.current);
                setIsScanning(false);
                setScanComplete(true);
                setScanStage('Scan complete!');
                setSources(prev => prev.map(s => ({ ...s, status: 'checked' })));
            } else {
                // Update stage
                const newStageIndex = Math.floor((progress / 100) * (scanStages.length - 1));
                if (newStageIndex !== stageIndex) {
                    stageIndex = newStageIndex;
                    setScanStage(scanStages[stageIndex]);
                }

                // Update sources
                const newSourceIndex = Math.floor((progress / 100) * sources.length);
                if (newSourceIndex !== sourceIndex && newSourceIndex < sources.length) {
                    sourceIndex = newSourceIndex;
                    setSources(prev => prev.map((s, i) => ({
                        ...s,
                        status: i < sourceIndex ? 'checked' : i === sourceIndex ? 'scanning' : 'pending'
                    })));
                }
            }

            setScanProgress(progress);
        }, 200);
    };

    useEffect(() => {
        return () => {
            if (scanInterval.current) {
                clearInterval(scanInterval.current);
            }
        };
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'checked': return '✅';
            case 'scanning': return '🔄';
            default: return '⏳';
        }
    };

    return (
        <div className={`dark-web-monitor ${isScanning ? 'scanning' : ''} ${scanComplete ? 'complete' : ''}`}>
            <div className="monitor-header">
                <div className="header-left">
                    <div className={`status-indicator ${isScanning ? 'active' : scanComplete ? (breached ? 'danger' : 'safe') : ''}`}>
                        <span className="pulse-ring"></span>
                        <span className="status-dot"></span>
                    </div>
                    <div className="header-text">
                        <h3>🌐 Dark Web Monitor</h3>
                        <p>Real-time breach detection</p>
                    </div>
                </div>

                <button
                    className={`scan-btn ${isScanning ? 'scanning' : ''}`}
                    onClick={startScan}
                    disabled={isScanning || !password}
                >
                    {isScanning ? (
                        <>
                            <span className="scan-icon rotating">⟳</span>
                            Scanning...
                        </>
                    ) : (
                        <>
                            <span className="scan-icon">🔍</span>
                            {scanComplete ? 'Rescan' : 'Start Scan'}
                        </>
                    )}
                </button>
            </div>

            {(isScanning || scanComplete) && (
                <div className="scan-content">
                    {/* Progress Bar */}
                    <div className="progress-section">
                        <div className="progress-bar-container">
                            <div
                                className="progress-bar"
                                style={{ width: `${scanProgress}%` }}
                            />
                            <div className="progress-glow" style={{ left: `${scanProgress}%` }} />
                        </div>
                        <div className="progress-info">
                            <span className="progress-stage">{scanStage}</span>
                            <span className="progress-percent">{Math.round(scanProgress)}%</span>
                        </div>
                    </div>

                    {/* Sources List */}
                    <div className="sources-list">
                        {sources.map((source, index) => (
                            <div
                                key={index}
                                className={`source-item ${source.status}`}
                            >
                                <span className="source-icon">{source.icon}</span>
                                <div className="source-info">
                                    <span className="source-name">{source.name}</span>
                                    <span className="source-count">{source.count} records</span>
                                </div>
                                <span className={`source-status ${source.status}`}>
                                    {getStatusIcon(source.status)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Results */}
                    {scanComplete && (
                        <div className={`scan-result ${breached ? 'danger' : 'safe'}`}>
                            {breached ? (
                                <>
                                    <div className="result-icon danger">🚨</div>
                                    <div className="result-content">
                                        <h4>Password Compromised!</h4>
                                        <p>Found in <strong>{breachCount?.toLocaleString() || 'multiple'}</strong> data breaches</p>
                                        <span className="result-warning">⚠️ Change this password immediately!</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="result-icon safe">✅</div>
                                    <div className="result-content">
                                        <h4>No Breaches Found</h4>
                                        <p>This password was not found in any known data breaches</p>
                                        <span className="result-safe">🛡️ Your password appears to be secure</span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {!isScanning && !scanComplete && password && (
                <div className="monitor-idle">
                    <div className="idle-icon">🔒</div>
                    <p>Click "Start Scan" to check if your password appears on the dark web</p>
                </div>
            )}

            {!password && (
                <div className="monitor-empty">
                    <div className="empty-icon">💭</div>
                    <p>Enter a password above to enable dark web scanning</p>
                </div>
            )}
        </div>
    );
}

export default DarkWebMonitor;
