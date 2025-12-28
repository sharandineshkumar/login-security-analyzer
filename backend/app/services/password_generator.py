"""
Secure Password Generator Service
Generates cryptographically secure random passwords
"""

import secrets
import string
from typing import Optional


class PasswordGenerator:
    """Generate secure random passwords"""
    
    # Character sets
    UPPERCASE = string.ascii_uppercase  # A-Z
    LOWERCASE = string.ascii_lowercase  # a-z
    NUMBERS = string.digits  # 0-9
    SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    
    # Ambiguous characters that can be confused
    AMBIGUOUS = "0O1lI|"
    
    def generate(
        self,
        length: int = 16,
        uppercase: bool = True,
        lowercase: bool = True,
        numbers: bool = True,
        symbols: bool = True,
        exclude_ambiguous: bool = True
    ) -> str:
        """
        Generate a secure random password.
        
        Args:
            length: Password length (default: 16, min: 4, max: 128)
            uppercase: Include uppercase letters (A-Z)
            lowercase: Include lowercase letters (a-z)
            numbers: Include numbers (0-9)
            symbols: Include special characters
            exclude_ambiguous: Exclude visually similar characters (0, O, 1, l, I, |)
            
        Returns:
            A secure random password string
        """
        # Validate length
        length = max(4, min(128, length))
        
        # Build character set based on options
        charset = ""
        required_chars = []
        
        if uppercase:
            chars = self.UPPERCASE
            if exclude_ambiguous:
                chars = ''.join(c for c in chars if c not in self.AMBIGUOUS)
            charset += chars
            required_chars.append(secrets.choice(chars))
        
        if lowercase:
            chars = self.LOWERCASE
            if exclude_ambiguous:
                chars = ''.join(c for c in chars if c not in self.AMBIGUOUS)
            charset += chars
            required_chars.append(secrets.choice(chars))
        
        if numbers:
            chars = self.NUMBERS
            if exclude_ambiguous:
                chars = ''.join(c for c in chars if c not in self.AMBIGUOUS)
            charset += chars
            required_chars.append(secrets.choice(chars))
        
        if symbols:
            chars = self.SYMBOLS
            if exclude_ambiguous:
                chars = ''.join(c for c in chars if c not in self.AMBIGUOUS)
            charset += chars
            required_chars.append(secrets.choice(chars))
        
        # Fallback if no options selected
        if not charset:
            charset = self.LOWERCASE
            required_chars = [secrets.choice(charset)]
        
        # Generate remaining characters
        remaining_length = length - len(required_chars)
        remaining_chars = [secrets.choice(charset) for _ in range(remaining_length)]
        
        # Combine and shuffle
        all_chars = required_chars + remaining_chars
        
        # Use Fisher-Yates shuffle with secrets for security
        for i in range(len(all_chars) - 1, 0, -1):
            j = secrets.randbelow(i + 1)
            all_chars[i], all_chars[j] = all_chars[j], all_chars[i]
        
        return ''.join(all_chars)
    
    def generate_passphrase(
        self,
        word_count: int = 4,
        separator: str = "-",
        capitalize: bool = True
    ) -> str:
        """
        Generate a memorable passphrase using random words.
        
        Args:
            word_count: Number of words (default: 4)
            separator: Character between words (default: -)
            capitalize: Capitalize first letter of each word
            
        Returns:
            A passphrase string
        """
        # Simple word list for passphrases
        # In production, use a larger word list like EFF's dice word list
        words = [
            "apple", "banana", "cherry", "dragon", "eagle", "falcon",
            "galaxy", "harbor", "island", "jungle", "kindle", "lemon",
            "mango", "nebula", "ocean", "phoenix", "quartz", "river",
            "sunset", "tiger", "umbrella", "violin", "window", "xylophone",
            "yellow", "zebra", "anchor", "bridge", "castle", "diamond",
            "eclipse", "forest", "glacier", "horizon", "iceberg", "jasmine",
            "kingdom", "lantern", "mountain", "nitrogen", "oxygen", "pyramid",
            "quantum", "rainbow", "satellite", "thunder", "universe", "volcano",
            "winter", "crystal", "dolphin", "elephant", "firefly", "garden"
        ]
        
        # Select random words
        selected = [secrets.choice(words) for _ in range(word_count)]
        
        # Capitalize if requested
        if capitalize:
            selected = [word.capitalize() for word in selected]
        
        return separator.join(selected)
