// routes/vault.js
const express = require("express");
const router = express.Router();
const { setVaultPassword, verifyVaultPassword } = require("../controllers/vaultController");
const { protect } = require("../middleware/auth");

// ✅ Set vault password – user must be authenticated
router.post("/set", protect, setVaultPassword);

// ✅ Verify vault password – user must be authenticated
router.post("/verify", protect, verifyVaultPassword);

module.exports = router;
