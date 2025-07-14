from Crypto.Cipher import AES, DES
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad
import base64
import os

# Hardcoded keys as specified
AES_KEY = b'sumantrasumantra'  # 16-byte key for AES (Changed from 'ranjeetranjeet12')
DES_KEY = b'sumantra'          # 8-byte key for DES (Changed from 'ranjeet!')

# Generate RSA key pair (for demonstration)
def generate_rsa_keys():
    key = RSA.generate(2048)
    private_key = key
    public_key = key.publickey()
    return private_key, public_key

# Store RSA keys globally for this session
RSA_PRIVATE_KEY, RSA_PUBLIC_KEY = generate_rsa_keys()

def encrypt_text(plaintext, algorithm):
    """Encrypt text using the specified algorithm"""
    try:
        if algorithm == 'AES':
            return encrypt_aes_text(plaintext)
        elif algorithm == 'DES':
            return encrypt_des_text(plaintext)
        elif algorithm == 'RSA':
            return encrypt_rsa_text(plaintext)
        else:
            raise ValueError(f"Unsupported algorithm: {algorithm}")
    except Exception as e:
        raise Exception(f"Encryption failed: {str(e)}")

def decrypt_text(ciphertext, algorithm):
    """Decrypt text using the specified algorithm"""
    try:
        if algorithm == 'AES':
            return decrypt_aes_text(ciphertext)
        elif algorithm == 'DES':
            return decrypt_des_text(ciphertext)
        elif algorithm == 'RSA':
            return decrypt_rsa_text(ciphertext)
        else:
            raise ValueError(f"Unsupported algorithm: {algorithm}")
    except Exception as e:
        raise Exception(f"Decryption failed: {str(e)}")

def encrypt_file(file_data, algorithm):
    """Encrypt file data using the specified algorithm"""
    try:
        if algorithm == 'AES':
            return encrypt_aes_file(file_data)
        elif algorithm == 'DES':
            return encrypt_des_file(file_data)
        else:
            raise ValueError(f"Unsupported algorithm for files: {algorithm}")
    except Exception as e:
        raise Exception(f"File encryption failed: {str(e)}")

def decrypt_file(file_data, algorithm):
    """Decrypt file data using the specified algorithm"""
    try:
        if algorithm == 'AES':
            return decrypt_aes_file(file_data)
        elif algorithm == 'DES':
            return decrypt_des_file(file_data)
        else:
            raise ValueError(f"Unsupported algorithm for files: {algorithm}")
    except Exception as e:
        raise Exception(f"File decryption failed: {str(e)}")

# AES Text Encryption/Decryption
def encrypt_aes_text(plaintext):
    """Encrypt text using AES"""
    iv = get_random_bytes(16)  # AES block size is 16 bytes
    cipher = AES.new(AES_KEY, AES.MODE_CBC, iv)
    
    # Pad the plaintext to be multiple of 16 bytes
    padded_text = pad(plaintext.encode('utf-8'), AES.block_size)
    
    # Encrypt the padded text
    ciphertext = cipher.encrypt(padded_text)
    
    # Combine IV and ciphertext, then encode in base64
    encrypted_data = iv + ciphertext
    return base64.b64encode(encrypted_data).decode('utf-8')

def decrypt_aes_text(ciphertext):
    """Decrypt text using AES"""
    # Decode from base64
    encrypted_data = base64.b64decode(ciphertext.encode('utf-8'))
    
    # Extract IV and ciphertext
    iv = encrypted_data[:16]
    ciphertext_bytes = encrypted_data[16:]
    
    # Create cipher and decrypt
    cipher = AES.new(AES_KEY, AES.MODE_CBC, iv)
    padded_plaintext = cipher.decrypt(ciphertext_bytes)
    
    # Remove padding and decode
    plaintext = unpad(padded_plaintext, AES.block_size)
    return plaintext.decode('utf-8')

# DES Text Encryption/Decryption
def encrypt_des_text(plaintext):
    """Encrypt text using DES"""
    iv = get_random_bytes(8)  # DES block size is 8 bytes
    cipher = DES.new(DES_KEY, DES.MODE_CBC, iv)
    
    # Pad the plaintext to be multiple of 8 bytes
    padded_text = pad(plaintext.encode('utf-8'), DES.block_size)
    
    # Encrypt the padded text
    ciphertext = cipher.encrypt(padded_text)
    
    # Combine IV and ciphertext, then encode in base64
    encrypted_data = iv + ciphertext
    return base64.b64encode(encrypted_data).decode('utf-8')

def decrypt_des_text(ciphertext):
    """Decrypt text using DES"""
    # Decode from base64
    encrypted_data = base64.b64decode(ciphertext.encode('utf-8'))
    
    # Extract IV and ciphertext
    iv = encrypted_data[:8]
    ciphertext_bytes = encrypted_data[8:]
    
    # Create cipher and decrypt
    cipher = DES.new(DES_KEY, DES.MODE_CBC, iv)
    padded_plaintext = cipher.decrypt(ciphertext_bytes)
    
    # Remove padding and decode
    plaintext = unpad(padded_plaintext, DES.block_size)
    return plaintext.decode('utf-8')

# RSA Text Encryption/Decryption
def encrypt_rsa_text(plaintext):
    """Encrypt text using RSA"""
    cipher = PKCS1_OAEP.new(RSA_PUBLIC_KEY)
    
    # RSA can only encrypt small amounts of data
    # For larger text, you would typically use hybrid encryption
    ciphertext = cipher.encrypt(plaintext.encode('utf-8'))
    
    return base64.b64encode(ciphertext).decode('utf-8')

def decrypt_rsa_text(ciphertext):
    """Decrypt text using RSA"""
    cipher = PKCS1_OAEP.new(RSA_PRIVATE_KEY)
    
    # Decode from base64 and decrypt
    ciphertext_bytes = base64.b64decode(ciphertext.encode('utf-8'))
    plaintext = cipher.decrypt(ciphertext_bytes)
    
    return plaintext.decode('utf-8')

# AES File Encryption/Decryption
def encrypt_aes_file(file_data):
    """Encrypt file data using AES"""
    iv = get_random_bytes(16)  # AES block size is 16 bytes
    cipher = AES.new(AES_KEY, AES.MODE_CBC, iv)
    
    # Pad the file data to be multiple of 16 bytes
    padded_data = pad(file_data, AES.block_size)
    
    # Encrypt the padded data
    ciphertext = cipher.encrypt(padded_data)
    
    # Combine IV and ciphertext
    encrypted_data = iv + ciphertext
    return encrypted_data

def decrypt_aes_file(encrypted_data):
    """Decrypt file data using AES"""
    # Extract IV and ciphertext
    iv = encrypted_data[:16]
    ciphertext = encrypted_data[16:]
    
    # Create cipher and decrypt
    cipher = AES.new(AES_KEY, AES.MODE_CBC, iv)
    padded_data = cipher.decrypt(ciphertext)
    
    # Remove padding
    file_data = unpad(padded_data, AES.block_size)
    return file_data

# DES File Encryption/Decryption
def encrypt_des_file(file_data):
    """Encrypt file data using DES"""
    iv = get_random_bytes(8)  # DES block size is 8 bytes
    cipher = DES.new(DES_KEY, DES.MODE_CBC, iv)
    
    # Pad the file data to be multiple of 8 bytes
    padded_data = pad(file_data, DES.block_size)
    
    # Encrypt the padded data
    ciphertext = cipher.encrypt(padded_data)
    
    # Combine IV and ciphertext
    encrypted_data = iv + ciphertext
    return encrypted_data

def decrypt_des_file(encrypted_data):
    """Decrypt file data using DES"""
    # Extract IV and ciphertext
    iv = encrypted_data[:8]
    ciphertext = encrypted_data[8:]
    
    # Create cipher and decrypt
    cipher = DES.new(DES_KEY, DES.MODE_CBC, iv)
    padded_data = cipher.decrypt(ciphertext)
    
    # Remove padding
    file_data = unpad(padded_data, DES.block_size)
    return file_data
