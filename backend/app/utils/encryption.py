# Data encryption

from cryptography.fernet import Fernet
from app.config import settings
import json

# Generate key: settings.SECRET_KEY[:32].encode()
cipher = Fernet(Fernet.generate_key())

def encrypt_data(data: list) -> str:
    """Encrypt list to string"""
    json_str = json.dumps(data)
    encrypted = cipher.encrypt(json_str.encode())
    return encrypted.decode()

def decrypt_data(encrypted_str: str) -> list:
    """Decrypt string to list"""
    try:
        decrypted = cipher.decrypt(encrypted_str.encode())
        return json.loads(decrypted.decode())
    except:
        return []