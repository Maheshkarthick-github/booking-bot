const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const geminiRoutes = require('./routes/gemini');
const flightRoutes = require('./routes/flight');

// ✅ Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use('/api/gemini', geminiRoutes);
app.use('/api/flight', flightRoutes);

// ✅ Health check endpoint
app.get('/', (req, res) => {
  res.send('🚀 Backend is running');
});

// ✅ Start server
app.listen(PORT, () => {
  if (!process.env.SERPAPI_KEY) {
  console.warn('⚠️  SERPAPI_KEY is missing in .env file. Flight API will fail.');
}


  console.log(`✅ Server running on http://localhost:${PORT}`);
});
