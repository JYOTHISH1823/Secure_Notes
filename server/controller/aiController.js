const OpenAI = require("openai");
const rateLimit = require("express-rate-limit");

const OPENAI_KEY = process.env.OPENAI_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_KEY
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false
});

async function summarize(req, res) {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "text required" });
  if (!OPENAI_KEY) return res.status(500).json({ message: "AI key not configured" });

  try {
    const prompt = `Summarize the following note in 2-3 sentences:\n\n${text}`;
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt,
      max_tokens: 150,
      temperature: 0.2
    });
    const summary = response.choices?.[0]?.text?.trim();
    res.json({ summary });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ message: "AI error" });
  }
}

module.exports = { summarize, aiLimiter };