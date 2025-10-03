const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const {
  createJournal,
  getJournals,
  getSummaryNarrative,
  deleteJournal,
} = require("../controllers/journal.controller");

router.post("/", verifyToken, createJournal);
router.get("/", verifyToken, getJournals);
router.get("/summary", verifyToken, getSummaryNarrative);
router.delete("/:id", verifyToken, deleteJournal);

module.exports = router;
