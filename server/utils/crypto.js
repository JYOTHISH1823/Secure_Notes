const crypto = require('crypto');
const ALGO = 'aes-256-gcm';
const MASTER_KEY = process.env.MASTER_KEY_BASE64
  ? Buffer.from(process.env.MASTER_KEY_BASE64, 'base64')
  : null;

if (!MASTER_KEY || MASTER_KEY.length !== 32) {
  console.warn('MASTER_KEY_BASE64 missing or not 32 bytes when decoded. Generate one and set in .env.');
}

function generateDEK() {
  return crypto.randomBytes(32);
}
function wrapDEK(dekBuffer) {
  if (!MASTER_KEY) throw new Error('MASTER_KEY not configured');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, MASTER_KEY, iv, { authTagLength: 16 });
  const encrypted = Buffer.concat([cipher.update(dekBuffer), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}
function unwrapDEK(wrappedBase64) {
  if (!MASTER_KEY) throw new Error('MASTER_KEY not configured');
  const data = Buffer.from(wrappedBase64, 'base64');
  const iv = data.slice(0, 12);
  const tag = data.slice(12, 28);
  const encrypted = data.slice(28);
  const decipher = crypto.createDecipheriv(ALGO, MASTER_KEY, iv, { authTagLength: 16 });
  decipher.setAuthTag(tag);
  const dek = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return dek;
}
function encryptWithDEK(plaintext, dekBuffer) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, dekBuffer, iv, { authTagLength: 16 });
  const ciphertext = Buffer.concat([cipher.update(Buffer.from(plaintext, 'utf8')), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]).toString('base64');
}
function decryptWithDEK(b64, dekBuffer) {
  const data = Buffer.from(b64, 'base64');
  const iv = data.slice(0, 12);
  const tag = data.slice(12, 28);
  const ciphertext = data.slice(28);
  const decipher = crypto.createDecipheriv(ALGO, dekBuffer, iv, { authTagLength: 16 });
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString('utf8');
}

module.exports = {
  generateDEK,
  wrapDEK,
  unwrapDEK,
  encryptWithDEK,
  decryptWithDEK
};