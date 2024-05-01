const axios = require("axios");

require("dotenv").config();

const axiosLivepeer = axios.create({
  baseURL: "https://livepeer.com/api/",
  headers: {
    Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`,
    "Content-Type": "application/json",
  },
});

module.exports = axiosLivepeer;
