"""
Password Strength Analyzer Service
Analyzes passwords for strength, patterns, and vulnerabilities
"""

import re
from typing import Dict, List, Any


class PasswordAnalyzer:
    """Comprehensive password strength analyzer"""
    
    # Common passwords that should always be flagged
    COMMON_PASSWORDS = {
        "password", "123456", "12345678", "qwerty", "abc123",
        "monkey", "1234567", "letmein", "trustno1", "dragon",
        "baseball", "master", "michael", "shadow", "ashley",
        "foobar", "123123", "654321", "superman", "qazwsx",
        "admin", "administrator", "root", "login", "welcome",
        "password1", "password123", "passw0rd", "p@ssword",
        "iloveyou", "princess", "sunshine", "whatever", "ninja"
    }
    
    # Keyboard patterns to detect
    KEYBOARD_PATTERNS = [
        "qwerty", "qwertz", "azerty", "asdf", "zxcv",
        "qazwsx", "1qaz", "2wsx", "3edc", "4rfv",
        "!qaz", "@wsx", "#edc", "$rfv"
    ]
    
    # Sequential patterns
    SEQUENTIAL_PATTERNS = [
        "012", "123", "234", "345", "456", "567", "678", "789",
        "abc", "bcd", "cde", "def", "efg", "fgh", "ghi", "hij",
        "ijk", "jkl", "klm", "lmn", "mno", "nop", "opq", "pqr",
        "qrs", "rst", "stu", "tuv", "uvw", "vwx", "wxy", "xyz"
    ]
    
    # Repeated patterns
    REPEATED_CHARS = re.compile(r'(.)\1{2,}')  # 3+ repeated chars
    
    def analyze(self, password: str) -> Dict[str, Any]:
        """
        Analyze a password and return detailed strength information.
        
        Returns:
            Dictionary containing score, strength level, feedback, and details
        """
        if not password:
            return self._empty_result()
        
        score = 0
        feedback = []
        suggestions = []
        details = {
            "length": len(password),
            "has_uppercase": False,
            "has_lowercase": False,
            "has_numbers": False,
            "has_symbols": False,
            "is_common": False,
            "has_patterns": False,
            "has_repeated": False
        }
        
        # ==================== Length Analysis ====================
        length = len(password)
        details["length"] = length
        
        if length >= 16:
            score += 30
        elif length >= 12:
            score += 25
        elif length >= 10:
            score += 20
        elif length >= 8:
            score += 15
        elif length >= 6:
            score += 10
            feedback.append("Password is too short")
            suggestions.append("Use at least 8 characters (12+ recommended)")
        else:
            score += 5
            feedback.append("Password is very short")
            suggestions.append("Use at least 8 characters (12+ recommended)")
        
        # ==================== Character Variety ====================
        
        # Uppercase letters
        if re.search(r'[A-Z]', password):
            score += 15
            details["has_uppercase"] = True
        else:
            feedback.append("No uppercase letters")
            suggestions.append("Add uppercase letters (A-Z)")
        
        # Lowercase letters
        if re.search(r'[a-z]', password):
            score += 10
            details["has_lowercase"] = True
        else:
            feedback.append("No lowercase letters")
            suggestions.append("Add lowercase letters (a-z)")
        
        # Numbers
        if re.search(r'\d', password):
            score += 15
            details["has_numbers"] = True
        else:
            feedback.append("No numbers")
            suggestions.append("Add numbers (0-9)")
        
        # Special characters
        if re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?`~]', password):
            score += 20
            details["has_symbols"] = True
        else:
            feedback.append("No special characters")
            suggestions.append("Add special characters (!@#$%^&*)")
        
        # ==================== Pattern Detection ====================
        
        # Common password check
        if password.lower() in self.COMMON_PASSWORDS:
            score = max(5, score - 40)
            details["is_common"] = True
            feedback.insert(0, "⚠️ This is a commonly used password!")
            suggestions.insert(0, "Choose a unique password that isn't commonly used")
        
        # Keyboard patterns
        password_lower = password.lower()
        for pattern in self.KEYBOARD_PATTERNS:
            if pattern in password_lower:
                score = max(5, score - 15)
                details["has_patterns"] = True
                if "Keyboard pattern detected" not in feedback:
                    feedback.append("Keyboard pattern detected")
                    suggestions.append("Avoid keyboard patterns like 'qwerty' or 'asdf'")
                break
        
        # Sequential patterns
        for pattern in self.SEQUENTIAL_PATTERNS:
            if pattern in password_lower:
                score = max(5, score - 10)
                details["has_patterns"] = True
                if "Sequential pattern detected" not in feedback:
                    feedback.append("Sequential pattern detected")
                    suggestions.append("Avoid sequential characters like '123' or 'abc'")
                break
        
        # Repeated characters
        if self.REPEATED_CHARS.search(password):
            score = max(5, score - 10)
            details["has_repeated"] = True
            feedback.append("Repeated characters detected")
            suggestions.append("Avoid repeating the same character multiple times")
        
        # ==================== Calculate Final Score ====================
        
        # Bonus for mixing character types
        char_types = sum([
            details["has_uppercase"],
            details["has_lowercase"],
            details["has_numbers"],
            details["has_symbols"]
        ])
        
        if char_types >= 4:
            score += 10
        elif char_types >= 3:
            score += 5
        
        # Cap score at 100
        score = min(100, max(0, score))
        
        # Determine strength level
        strength, strength_color = self._get_strength_level(score)
        
        # Add encouragement if password is good
        if not feedback:
            feedback.append("✅ Great password!")
        
        return {
            "score": score,
            "strength": strength,
            "strength_color": strength_color,
            "feedback": feedback,
            "suggestions": suggestions,
            "details": details
        }
    
    def _get_strength_level(self, score: int) -> tuple:
        """Get strength level and color based on score"""
        if score >= 80:
            return ("Strong", "#22c55e")  # Green
        elif score >= 60:
            return ("Good", "#84cc16")    # Lime
        elif score >= 40:
            return ("Medium", "#eab308")  # Yellow
        elif score >= 20:
            return ("Weak", "#f97316")    # Orange
        else:
            return ("Very Weak", "#ef4444")  # Red
    
    def _empty_result(self) -> Dict[str, Any]:
        """Return result for empty password"""
        return {
            "score": 0,
            "strength": "None",
            "strength_color": "#6b7280",
            "feedback": ["Enter a password to analyze"],
            "suggestions": [],
            "details": {
                "length": 0,
                "has_uppercase": False,
                "has_lowercase": False,
                "has_numbers": False,
                "has_symbols": False,
                "is_common": False,
                "has_patterns": False,
                "has_repeated": False
            }
        }
