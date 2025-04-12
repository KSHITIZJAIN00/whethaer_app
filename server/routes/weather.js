// server/routes/weather.js
const express = require("express");
const axios = require("axios");
const apiKeys = require("../apiKeys");
const router = express.Router();

router.get("/weather", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const response = await axios.get(
      `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching weather data");
  }
});

module.exports = router;
