import CryptoJS from 'crypto-js';
const secretKey = process.env.SECRET_KEY; // Make sure to load your .env file

// Encryption function
export const encryptMessage = (message, secretKey) => {
    return CryptoJS.AES.encrypt(message, secretKey).toString();
};

// Decryption function
export const decryptMessage = (cipherText, secretKey) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};
