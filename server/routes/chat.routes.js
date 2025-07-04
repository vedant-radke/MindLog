const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const { chatWithAI } = require("../controllers/chat.controller");

router.post("/", verifyToken, chatWithAI);

module.exports = router;
