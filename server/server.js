const app = require('.');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})();