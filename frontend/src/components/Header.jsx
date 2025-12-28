import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <span className="logo-icon">🔐</span>
                    <div className="logo-text">
                        <h1>Login Security Analyzer</h1>
                        <p className="tagline">Protect your digital identity</p>
                    </div>
                </div>

                <nav className="header-nav">
                    <a
                        href="https://haveibeenpwned.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-link"
                    >
                        <span className="nav-icon">🔍</span>
                        <span>HIBP</span>
                    </a>
                </nav>
            </div>

            <div className="header-description">
                <p>
                    Check your password strength, detect common vulnerabilities, and verify
                    if your credentials have been exposed in data breaches.
                </p>
            </div>
        </header>
    );
}

export default Header;
