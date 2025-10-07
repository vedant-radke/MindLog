const crypto = require("crypto");
const sendEmail = require("./sendEmail");

const TOKEN_BYTES = 32;
const VERIFICATION_EXPIRY_HOURS = parseInt(
  process.env.EMAIL_VERIFICATION_EXPIRY_HOURS ?? "24",
  10
);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

function generateVerificationToken() {
  const token = crypto.randomBytes(TOKEN_BYTES).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(
    Date.now() + VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000
  );

  return { token, hash, expiresAt };
}

async function sendVerificationEmail(userEmail, token) {
  const verificationLink = `${CLIENT_URL}/verify?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="color: #047857;">Confirm your MindLog account</h2>
      <p>Thanks for creating your space on MindLog. Please confirm your email address to start journaling and chatting with your companion.</p>
      <p>
        <a href="${verificationLink}" style="display: inline-block; padding: 12px 20px; background-color: #047857; color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: 600;">
          Verify my email
        </a>
      </p>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${verificationLink}</p>
      <p>This link will expire in ${VERIFICATION_EXPIRY_HOURS} hours.</p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
      <p style="margin-top: 24px;">With care,<br/>The MindLog team</p>
    </div>
  `;

  await sendEmail(userEmail, "Verify your MindLog email", html);
}

module.exports = {
  generateVerificationToken,
  sendVerificationEmail,
};
