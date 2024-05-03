const express = require("express");

const axiosLivepeer = require("../config/axios");

const router = express.Router();

router.post("/create", async (req, res) => {
  const { name } = req.body;

  try {
    const response = await axiosLivepeer.post(
      "https://livepeer.studio/api/stream",
      {
        name,
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error calling Livepeer API:", error.message);
    res.status(error.response.status || 500).json({ message: error.message });
  }
});

module.exports = router;
