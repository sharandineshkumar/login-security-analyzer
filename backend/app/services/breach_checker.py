"""
Breach Checker Service
Checks passwords against Have I Been Pwned database
Uses k-anonymity to protect the password
"""

import hashlib
import httpx
from typing import Dict


class BreachChecker:
    """Check if passwords appear in known data breaches"""
    
    HIBP_API_URL = "https://api.pwnedpasswords.com/range/"
    
    async def check(self, password: str) -> Dict:
        """
        Check if a password has been exposed in known data breaches.
        
        Uses the Have I Been Pwned Pwned Passwords API with k-anonymity:
        - Only the first 5 characters of the SHA-1 hash are sent
        - The API returns all hashes that match that prefix
        - We check locally if our full hash is in the response
        
        This means the actual password never leaves the client/server.
        
        Args:
            password: The password to check
            
        Returns:
            Dictionary with breach status and count
        """
        if not password:
            return {
                "breached": False,
                "breach_count": 0,
                "message": "No password provided"
            }
        
        try:
            # Generate SHA-1 hash of the password
            sha1_hash = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
            
            # Split into prefix (first 5 chars) and suffix (rest)
            prefix = sha1_hash[:5]
            suffix = sha1_hash[5:]
            
            # Query the API with the prefix only
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.HIBP_API_URL}{prefix}",
                    headers={
                        "User-Agent": "LoginSecurityAnalyzer",
                        "Add-Padding": "true"  # Add padding for extra privacy
                    }
                )
                
                if response.status_code == 200:
                    # Parse the response - each line is "HASH_SUFFIX:COUNT"
                    hashes = response.text.splitlines()
                    
                    for line in hashes:
                        if ':' in line:
                            hash_suffix, count = line.split(':')
                            
                            if hash_suffix.upper() == suffix:
                                breach_count = int(count)
                                return {
                                    "breached": True,
                                    "breach_count": breach_count,
                                    "message": self._get_breach_message(breach_count)
                                }
                    
                    # Password not found in breaches
                    return {
                        "breached": False,
                        "breach_count": 0,
                        "message": "✅ Good news! This password was not found in any known data breaches."
                    }
                
                elif response.status_code == 429:
                    return {
                        "breached": False,
                        "breach_count": 0,
                        "message": "⚠️ Rate limited. Please try again later."
                    }
                
                else:
                    return {
                        "breached": False,
                        "breach_count": 0,
                        "message": f"⚠️ Could not check breaches (HTTP {response.status_code})"
                    }
        
        except httpx.TimeoutException:
            return {
                "breached": False,
                "breach_count": 0,
                "message": "⚠️ Breach check timed out. Please try again."
            }
        
        except Exception as e:
            return {
                "breached": False,
                "breach_count": 0,
                "message": f"⚠️ Could not check breaches: Service unavailable"
            }
    
    def _get_breach_message(self, count: int) -> str:
        """Generate appropriate warning message based on breach count"""
        if count >= 1000000:
            return f"🚨 CRITICAL: This password was found in {count:,} data breaches! Do NOT use this password!"
        elif count >= 100000:
            return f"⚠️ DANGER: This password appeared in {count:,} breaches. Choose a different password."
        elif count >= 10000:
            return f"⚠️ WARNING: This password was found in {count:,} breaches. It's not safe to use."
        elif count >= 1000:
            return f"⚠️ CAUTION: This password appeared in {count:,} breaches. Consider a different password."
        elif count >= 100:
            return f"⚠️ This password was found in {count:,} breaches. You should change it."
        else:
            return f"⚠️ This password was found in {count} data breach(es). Consider changing it."
