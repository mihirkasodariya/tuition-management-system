const crypto = require("crypto");
const { ENCRYPTION_KEY } = require("../Config/index.config");

// Should match frontend key and come from environment variables

const decryptPasswordFunction = (encryptedData) => {
  try {
    const { iv, ciphertext } = encryptedData;

    // Convert key to Buffer (must be exactly 32 bytes for AES-256)
    const key = Buffer.from(ENCRYPTION_KEY, "utf-8");

    // Convert IV from Base64 to Buffer
    const ivBuffer = Buffer.from(iv, "base64");

    // Convert ciphertext from Base64 to Buffer
    const encryptedBuffer = Buffer.from(ciphertext, "base64");
    // Create decipher
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, ivBuffer);

    // Decrypt (using 'binary' encoding for the encrypted data)
    let decrypted = decipher.update(encryptedBuffer, "binary", "utf8");

    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
};

module.exports = {
  decryptPasswordFunction,
};
