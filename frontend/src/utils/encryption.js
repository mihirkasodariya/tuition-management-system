import CryptoJS from 'crypto-js';

// This should ideally come from environment variables in a real application

export const encryptPassword = (password) => {
  const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;
  try {
    // Generate a random IV (Initialization Vector) for each encryption
    const iv = CryptoJS.lib.WordArray.random(16);

    // Encrypt the password using AES
    const encrypted = CryptoJS.AES.encrypt(password, CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Combine IV and ciphertext for transmission
    // IV doesn't need to be secret, but should be unique for each encryption
    const result = {
      iv: iv.toString(CryptoJS.enc.Base64),
      ciphertext: encrypted.toString(),
    };

    // Return as a stringified JSON or combine them as needed
    return result;
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
};

export const decryptPassword = (encryptedData) => {
  const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;
  try {
    // Parse the encrypted data to get IV and ciphertext
    const iv = CryptoJS.enc.Base64.parse(encryptedData.iv);
    const ciphertext = encryptedData.ciphertext;

    // Decrypt the password using AES
    const decrypted = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Convert decrypted data to string
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};
