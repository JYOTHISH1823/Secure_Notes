const jwt = require("jsonwebtoken");

exports.requireVault = (req, res, next) => {
  // Expect vault token in header
  const token = req.headers["x-vault-token"];
  if (!token) return res.status(401).json({ error: "Vault is locked" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.scope !== "vault") {
      return res.status(403).json({ error: "Invalid vault scope" });
    }
    // Optionally ensure sub matches auth user:
    if (req.user?.id && decoded.sub !== req.user.id) {
      return res.status(403).json({ error: "Vault token not for this user" });
    }
    next();
  } catch {
    return res.status(401).json({ error: "Invalid/expired vault token" });
  }
};