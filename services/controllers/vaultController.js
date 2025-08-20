const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const VAULT_JWT_TTL = "12h"; // how long the vault stays unlocked

exports.setVaultPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: "Password is required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.vaultPasswordHash = await bcrypt.hash(password, salt);
    await user.save();

    return res.json({ message: "Vault password set" });
  } catch (e) {
    return res.status(500).json({ error: "Failed to set vault password" });
  }
};

exports.verifyVaultPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: "Password is required" });

    const user = await User.findById(req.user.id).select("+vaultPasswordHash");
    if (!user || !user.vaultPasswordHash) {
      return res.status(400).json({ error: "Vault not initialized" });
    }

    const ok = await bcrypt.compare(password, user.vaultPasswordHash);
    if (!ok) return res.status(401).json({ error: "Invalid vault password" });

    const vaultToken = jwt.sign(
      { sub: req.user.id, scope: "vault" },
      process.env.JWT_SECRET,
      { expiresIn: VAULT_JWT_TTL }
    );

    return res.json({ vaultToken, expiresIn: VAULT_JWT_TTL });
  } catch (e) {
    return res.status(500).json({ error: "Failed to verify vault password" });
  }
};