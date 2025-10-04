import crypto from "crypto";

const algorithm = "aes-256-gcm"; // Strong encryption
const secretKey = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // 32 bytes key

// Encrypt function
export function encrypt(text) {
  const iv = crypto.randomBytes(16); // unique per encryption
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  

  const tag = cipher.getAuthTag().toString("hex");

  return {
    encryptedContent: encrypted,
    iv: iv.toString("hex"),
    tag,
  };
}

// Decrypt function
export function decrypt(encryptedContent, ivHex, tagHex) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(ivHex, "hex")
  );

  decipher.setAuthTag(Buffer.from(tagHex, "hex"));

  let decrypted = decipher.update(encryptedContent, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
