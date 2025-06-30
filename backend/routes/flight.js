const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  const apiKey = process.env.SERPAPI_KEY;
  const { from, to, date } = req.query;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing SerpApi API key" });
  }

  if (!from || !to || !date) {
    return res.status(400).json({ error: "Missing 'from', 'to', or 'date' parameters" });
  }

  console.log("🔍 Searching Google Flights via SerpApi:", { from, to, date });

  try {
    const response = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google_flights",
        departure_id: from,
        arrival_id: to,
        outbound_date: date,
        type: "2", // ✅ One-way
        currency: "INR",
        api_key: apiKey,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ SerpApi fetch failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Flight API call failed." });
  }
});

module.exports = router;
