require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const candidateRoutes = require('./routes/candidates');
const rankingRoutes = require('./routes/ranking');

const app = express();

connectDB();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.get('/health', (_, res) => res.json({ success: true, message: 'NeuroRank API healthy' }));
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/ranking', rankingRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`NeuroRank API running on port ${PORT}`);
});
