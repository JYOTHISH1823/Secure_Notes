require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { genericLimiter } = require('./middlewares/rateLimiterMiddleware');
const { errorHandler } = require('./middlewares/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');
const ideasRoutes = require('./routes/ideasRoutes');
const calendarRoutes = require('./routes/calenderRoutes');
const aiRoutes = require('./routes/aiRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const FRONTEND = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND, credentials: true }));

app.use(genericLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/ideas', ideasRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use(errorHandler);

module.exports = app;