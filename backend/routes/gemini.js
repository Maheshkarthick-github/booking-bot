const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
  const prompt = req.body.prompt;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Gemini API call failed' });
  }
});

module.exports = router;
