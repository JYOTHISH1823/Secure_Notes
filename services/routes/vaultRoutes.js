const express = require("express");
const router = express.Router();
const { setVaultPassword, verifyVaultPassword } = require("../controllers/vaultController");
const authMiddleware = require("../middleware/authMiddleware"); // Use login auth here

router.post("/set", authMiddleware, setVaultPassword);
router.post("/verify", authMiddleware, verifyVaultPassword);

module.exports = router;