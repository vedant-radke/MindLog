const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  verifyEmail,
  resendVerificationEmail,
} = require("../controllers/auth.controller");

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

module.exports = router;
