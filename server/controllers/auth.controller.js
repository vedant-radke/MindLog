const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const {
  generateVerificationToken,
  sendVerificationEmail,
} = require("../utils/verification");

const RESEND_COOLDOWN_MINUTES = parseInt(
  process.env.EMAIL_VERIFICATION_RESEND_MINUTES ?? "5",
  10
);

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const { token, hash, expiresAt } = generateVerificationToken();

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken: hash,
      verificationTokenExpires: expiresAt,
      verificationLastSentAt: new Date(),
    });

    await newUser.save();

    await sendVerificationEmail(email, token);

    res.status(201).json({
      message: "Account created. Please verify your email to continue.",
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not exists" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        needsVerification: true,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Verification token is required" });
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Verification token is invalid or has expired.",
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    user.verificationLastSentAt = null;
    await user.save();

    const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Email verified successfully.",
      token: authToken,
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Email verification failed",
      error: err.message,
    });
  }
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(200)
        .json({ message: "Verification email sent if account exists." });
    }

    if (user.isVerified) {
      return res.status(200).json({
        message: "Account is already verified.",
      });
    }

    if (
      user.verificationLastSentAt &&
      Date.now() - user.verificationLastSentAt.getTime() <
        RESEND_COOLDOWN_MINUTES * 60 * 1000
    ) {
      return res.status(429).json({
        message: `Please wait before requesting another verification email.`,
      });
    }

    const { token, hash, expiresAt } = generateVerificationToken();
    user.verificationToken = hash;
    user.verificationTokenExpires = expiresAt;
    user.verificationLastSentAt = new Date();
    await user.save();

    await sendVerificationEmail(user.email, token);

    res.status(200).json({
      message: "Verification email sent.",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to resend verification email",
      error: err.message,
    });
  }
};

module.exports = { signup, login, verifyEmail, resendVerificationEmail };
